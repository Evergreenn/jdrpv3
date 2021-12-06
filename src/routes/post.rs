use actix_web::{post, web, Error, Responder, HttpResponse};
use serde::{Deserialize, Serialize};
use crate::claim::*;
use crate::repository::manage::*;
use crate::security::password_manager::*;
use std::process::Command;
use crate::ws::ws;
use actix_web_grants::proc_macro::{has_any_role};
use chrono::{Duration, Utc};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use crate::claim::decode_jwt;

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
    Dd5
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
pub struct GameDelationmInput {
    pub game_id: String,
}

#[derive(Serialize)]
pub struct WebSocketAddress {
    ws_address: String
}



// #[derive(Debug)]
// pub struct AuthError{
//     name: &'static str,
// }

// impl std::error::Error for AuthError {
//     fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
//         Some(&self.name)
//     }
// }

// impl std::fmt::Display for AuthError {
//     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//         write!(f, "{}", self.name)
//     }
// }

// impl error::ResponseError for AuthError {}

#[post("/register")]
pub async fn create_token(info: web::Json<UserInput>) -> Result<HttpResponse, Error> {
    let user_info = info.into_inner();
    let pass_h = hash_password(&user_info.password);
    let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];

    let user_id = insert_new_user(&user_info.username, pass_h, (&*user_permissions).to_vec()).unwrap();

    let claims = Claims::new(user_id, user_info.username, user_permissions);
    let jwt = create_jwt(claims)?;
    let expiration_time = (Utc::now() + Duration::hours(dotenv!("TOKEN_DURATION_TIME_HOURS").parse::<i64>().unwrap())).timestamp();


    Ok(HttpResponse::Ok().json(LoginResult {
        jwt,
        expiration_time
    }))
}


#[post("/login")]
pub async fn login(info: web::Json<UserInput>) -> Result<HttpResponse, Error>{
    let user_info = info.into_inner();
    // let pass_h = hash_password(&user_info.password);
    

    //TODO: this
    let user_in_database = &get_user(&user_info.username)[0];
    //     HttpResponse::
    // if user_in_database.len() == 0 {
    //     Err()
    // }else {

    // }


    match verify_password(user_info.password.to_string(), user_in_database.password.to_string()) {
        true => {
            let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];
        
            let claims = Claims::new(user_in_database.user_id.to_string(), user_info.username, user_permissions);
            let jwt = create_jwt(claims)?;            
            let expiration_time = (Utc::now() + Duration::hours(dotenv!("TOKEN_DURATION_TIME_HOURS").parse::<i64>().unwrap())).timestamp();

            Ok(HttpResponse::Ok().json(LoginResult {
                jwt,
                expiration_time
            }))
        }
        false => {
            Ok(HttpResponse::Unauthorized().json(ErrorResult {
                message: String::from("Wrong Password")
            }))
        }
    }

}


#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/create-game")]
pub async fn create_game(info: web::Json<UserInputGame>, credentials: BearerAuth) -> impl Responder {
    let game_info = info.into_inner();

    println!("{:#?}", game_info);
    // println!("{:#?}", dotenv!("WS_BINARY_PATH"));



    //TODO: check values from input
    
    //TODO: start process with game parameters
    let sock = ws::get_free_socket_address();
    let cmd_args = format!("-w{}", sock);
    let cmd_arg = format!("-t{}", credentials.token());
    println!("{:#?}", sock);
    println!("{:#?}", cmd_args);

    let t = decode_jwt(credentials.token()).unwrap();

//TODO: b64 sock
    insert_new_game(game_info.gamename, game_info.password, t.user_id, game_info.cst, &sock);


    let _output = Command::new(dotenv!("WS_BINARY_PATH"))
    .arg(cmd_args)
    .arg(cmd_arg)
    .spawn()
    .unwrap();
    // .expect("failed to load socket");

    web::Json(WebSocketAddress{ws_address:sock})
}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/delete-game")]
pub async fn delete_game(info: web::Json<GameDelationmInput>, credentials: BearerAuth) -> impl Responder {
    let game_info = info.into_inner();
    let t = decode_jwt(credentials.token()).unwrap();

    match is_user_creator_of_game(t.user_id, &game_info.game_id) {
        Some(_) => {
            crate::repository::manage::delete_game(&game_info.game_id);
            web::Json(true)
        },
        None => {
            web::Json(false)
        }
    }
}

//TODO: a function for load the game with the save generated at the socket close event.