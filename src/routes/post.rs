use crate::claim::decode_jwt;
use crate::claim::*;
use crate::configuration::settings::Settings;
use crate::repository::manage::*;
use crate::security::password_manager::*;
use crate::ws::ws_helper;
use actix_web::{error, post, web, Error, HttpResponse, Responder, Result};
use actix_web_grants::proc_macro::has_any_role;
use actix_web_httpauth::extractors::bearer::BearerAuth;
use chrono::{Duration, Utc};
use derive_more::Error;
use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Deserialize)]
pub struct UserInput {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResult {
    pub jwt: String,
    pub expiration_time: i64,
}

#[derive(Serialize)]
pub struct ErrorResult {
    pub message: String,
}

#[derive(Deserialize, Debug)]
pub enum Cst {
    Dd3,
    Dd5,
}

impl std::fmt::Display for Cst {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match *self {
            Cst::Dd3 => write!(f, "dd3"),
            Cst::Dd5 => write!(f, "dd5"),
        }
    }
}

#[derive(Deserialize, Debug)]
pub struct UserInputGame {
    pub gamename: String,
    pub password: String,
    pub have_custom_rules: bool,
    pub cst: Cst,
}

#[derive(Deserialize, Debug)]
pub struct PlayerCs {
    pub name: String,
    pub class: String,
    pub race: String,
    pub particularity: String,
    pub color: String,
    pub avatar: String,
    pub alignment: String,
    pub strengh: u8,
    pub dexterity: u8,
    pub luck: u8,
    pub willpower: u8,
    pub endurance: u8,
    pub charism: u8,
    pub perception: u8,
    pub education: u8,
}

#[derive(Deserialize, Debug)]
pub struct UserInputPlayer {
    pub game_id: String,
    pub jsoned_cs: String,
}

#[derive(Deserialize, Debug)]
pub struct GameIdInput {
    pub game_id: String,
}

#[derive(Deserialize, Debug)]
pub struct GetPlayerInput {
    pub game_id: String,
    pub user_id: String,
}

#[derive(Serialize)]
pub struct WebSocketAddress {
    ws_address: String,
    game_id: String,
}

#[derive(Debug, Error)]
struct CustomError {
    message: &'static str,
    code: usize,
}

impl error::ResponseError for CustomError {
    fn error_response(&self) -> HttpResponse {
        HttpResponse::InternalServerError().json(self.to_string())
    }
}

impl std::fmt::Display for CustomError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(
            f,
            "{{\"code\" : {}, \"message\": \"{}\" }}",
            self.code, self.message
        )
    }
}

#[post("/register")]
pub async fn create_token(info: web::Json<UserInput>) -> Result<HttpResponse, Error> {
    let user_info = info.into_inner();
    let pass_h = hash_password(&user_info.password);
    let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];

    let user_id =
        insert_new_user(&user_info.username, pass_h, (&*user_permissions).to_vec()).unwrap();

    let claims = Claims::new(user_id, user_info.username, user_permissions);
    let jwt = create_jwt(claims)?;
    let expiration_time = (Utc::now()
        + Duration::hours(dotenv!("TOKEN_DURATION_TIME_HOURS").parse::<i64>().unwrap()))
    .timestamp();

    Ok(HttpResponse::Ok().json(LoginResult {
        jwt,
        expiration_time,
    }))
}

#[post("/login")]
pub async fn login(info: web::Json<UserInput>) -> Result<HttpResponse, Error> {
    let user_info = info.into_inner();
    // let pass_h = hash_password(&user_info.password);

    //TODO: this
    let user_in_database = &get_user(&user_info.username)[0];
    //     HttpResponse::
    // if user_in_database.len() == 0 {
    //     Err()
    // }else {

    // }

    match verify_password(
        user_info.password.to_string(),
        user_in_database.password.to_string(),
    ) {
        true => {
            let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];

            let claims = Claims::new(
                user_in_database.user_id.to_string(),
                user_info.username,
                user_permissions,
            );
            let jwt = create_jwt(claims)?;
            let expiration_time = (Utc::now()
                + Duration::hours(dotenv!("TOKEN_DURATION_TIME_HOURS").parse::<i64>().unwrap()))
            .timestamp();
            Ok(HttpResponse::Ok().json(LoginResult {
                jwt,
                expiration_time,
            }))
        }
        false => Ok(HttpResponse::Unauthorized().json(ErrorResult {
            message: String::from("Wrong Password"),
        })),
    }
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/player")]
pub async fn get_player(info: web::Json<GameIdInput>, credentials: BearerAuth) -> impl Responder {
    let game_info = info.into_inner();

    println!("{:#?}", game_info);
    let t = decode_jwt(credentials.token()).unwrap();
    let player = crate::repository::manage::get_player(t.user_id, game_info.game_id);

    println!("user get  from db {:#?}", player);

    web::Json(player)
}

//TODO: reformat this
#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/playertokened")]
pub async fn get_playertokened(info: web::Json<GetPlayerInput>) -> impl Responder {
    let game_info = info.into_inner();

    println!("{:#?}", game_info);
    // let t = decode_jwt(credentials.token()).unwrap();
    let player = crate::repository::manage::get_player(game_info.user_id, game_info.game_id);

    println!("user get from db {:#?}", player);

    web::Json(player)
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/create-game")]
pub async fn create_game(
    info: web::Json<UserInputGame>,
    credentials: BearerAuth,
) -> impl Responder {
    let game_info = info.into_inner();

    println!("{:#?}", game_info);
    //TODO: check values from input
    //TODO: start process with game parameters

    let token_arg = format!("-t{}", credentials.token());

    let t = decode_jwt(credentials.token()).unwrap();
    
    let game_id = insert_new_game(
        game_info.gamename,
        game_info.password,
        t.user_id,
        game_info.cst,
    );
    
    let sock = ws_helper::get_free_socket_address(&game_id);
    let socket_args = format!("-w{}", sock);
    
    let gameid_argg = format!("-g{}", game_id);

    let _output = Command::new(dotenv!("WS_BINARY_PATH"))
        .args([socket_args, token_arg, gameid_argg])
        .spawn()
        .unwrap();
    // .expect("failed to load socket");

    web::Json(WebSocketAddress {
        game_id,
        ws_address: sock,
    })
}


#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/start-game")]
pub async fn start_game(
    info: web::Json<GameIdInput>,
    credentials: BearerAuth,
) -> impl Responder {
    let game_info = info.into_inner();

    println!("{:#?}", game_info);
    //TODO: check values from input
    //TODO: start process with game parameters

    let sock = ws_helper::get_free_socket_address(&game_info.game_id);
    let socket_args = format!("-w{}", sock);
    let token_arg = format!("-t{}", credentials.token());

    // let t = decode_jwt(credentials.token()).unwrap();

    // let game_id = insert_new_game(
    //     game_info.gamename,
    //     game_info.password,
    //     t.user_id,
    //     game_info.cst,
    // );

    let gameid_argg = format!("-g{}", game_info.game_id);

<<<<<<< HEAD
    let _output = Command::new(dotenv!("WS_BINARY_PATH"))
        .args([socket_args, token_arg, gameid_argg])
=======


    // let _output = Command::new(dotenv!("WS_BINARY_PATH"))
    let _output = Command::new("/home/guillaume/Projects/test/jdrpv3-socket/target/release/jdrpv3socket")
        .arg(cmd_args)
        .arg(cmd_arg)
        .arg(cmd_argg)
>>>>>>> layout fix
        .spawn()
        .unwrap();
    // .expect("failed to load socket");

    web::Json(WebSocketAddress {
        game_id: game_info.game_id,
        ws_address: sock,
    })
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/delete-game")]
pub async fn delete_game(info: web::Json<GameIdInput>, credentials: BearerAuth) -> impl Responder {
    let game_info = info.into_inner();
    let t = decode_jwt(credentials.token()).unwrap();

    match is_user_creator_of_game(t.user_id, &game_info.game_id) {
        Some(_) => {
            crate::repository::manage::delete_game(&game_info.game_id);
            web::Json(true)
        }
        None => web::Json(false),
    }
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/socket-address")]
pub async fn get_socket_address(info: web::Json<GameIdInput>) -> impl Responder {
    let game_info = info.into_inner();

    match ws_helper::get_socket_for_player(&game_info.game_id) {
        Some(e) => {
            println!("socket of game id: {:#?}  : {:#?}", game_info.game_id, e);

            Ok(web::Json(WebSocketAddress {
                game_id: game_info.game_id,
                ws_address: e,
            }))
        }
        None => Err(CustomError {
            code: 1376854,
            message: "Game is ghosted",
        }),
    }
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/create_player")]
pub async fn create_player(
    playerinput: web::Json<UserInputPlayer>,
    credentials: BearerAuth,
) -> impl Responder {
    let playerinput = playerinput.into_inner();
    let token = decode_jwt(credentials.token()).unwrap();

    println!("received from player creation: {:#?}", playerinput);

    let u: PlayerCs = serde_json::from_str(&playerinput.jsoned_cs).unwrap();

    let s = Settings::new();

    match s {
        Ok(config) => {
            let tmp = vec![
                u.strengh,
                u.dexterity,
                u.endurance,
                u.charism,
                u.perception,
                u.luck,
                u.willpower,
                u.education,
            ];

            let w = tmp
                .iter()
                .filter(|s| {
                    s > &&config.game_stats.max_per_cat || s < &&config.game_stats.min_per_cat
                })
                .count();

            let t: u16 = tmp.iter().map(|&b| b as u16).sum();

            if w > 0 || t > config.game_stats.max_stat {
                Err(CustomError {
                    code: 16873154,
                    message: "Stats have been altered",
                })
            } else {
                println!("Player Saved {:#?}", u);

                match insert_new_player(token.user_id, playerinput.game_id, playerinput.jsoned_cs) {
                    Ok(e) => {
                        println!("Player id {:#?}", e);
                        Ok(web::Json(true))
                    }
                    _ => Err(CustomError {
                        code: 14567956,
                        message: "Can´t insert into database",
                    }),
                }
            }
        }
        Err(e) => {
            println!("{:#?}", e);
            Err(CustomError {
                code: 60421676,
                message: "ConfigurationError",
            })
        }
    }
}

//TODO: a function for load the game with the save generated at the socket close event.
