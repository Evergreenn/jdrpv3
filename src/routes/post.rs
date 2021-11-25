use actix_web::{post, web, Error, Responder};
use serde::{Deserialize, Serialize};
use crate::claim::*;
use crate::repository::manage::*;
use crate::security::password_manager::*;
use std::process::Command;
use crate::ws::ws;
use actix_web_grants::proc_macro::{has_any_role};
// use std::error::Error;

#[derive(Deserialize)]
pub struct UserInput {
    pub username: String,
    pub password: String,
}


#[derive(Deserialize)]
pub struct UserInputGame {
    pub gamename: String,
    pub password: String,
    pub have_custom_rules: bool,
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
pub async fn create_token(info: web::Json<UserInput>) -> Result<String, Error> {
    let user_info = info.into_inner();
    let pass_h = hash_password(&user_info.password);
    let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];

    insert_new_user(&user_info.username, pass_h, (&*user_permissions).to_vec());

    let claims = Claims::new(user_info.username, user_permissions);
    let jwt = create_jwt(claims)?;

    Ok(jwt)
}


#[post("/login")]
pub async fn login(info: web::Json<UserInput>) -> Result<String, Error>{
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
        
            let claims = Claims::new(user_info.username, user_permissions);
            let jwt = create_jwt(claims)?;
            Ok(jwt)
        }
        false => {
            Ok("wrong password".to_string())
        }
    }

}


#[has_any_role("ADMIN", "MDJ", "USER")]
#[post("/create-game")]
pub async fn create_game(info: web::Json<UserInputGame>) -> impl Responder {
    let _game_info = info.into_inner();

    //TODO: check values from input
    
    //TODO: get available socket address 

    //TODO: start process with game parameters
    let sock = ws::get_free_socket_address();
    let cmd_args = format!("-w{}", sock);
    println!("{:#?}", sock);
    println!("{:#?}", cmd_args);

    let _output = Command::new(dotenv!("WS_BINARY_PATH"))
    .arg(cmd_args)
    .spawn()
    .unwrap();
    // .expect("failed to load socket");

    // println!("{:#?}", output);
    
    web::Json(WebSocketAddress{ws_address:sock})

    // Ok("oui".to_string())
}