#[macro_use]
extern crate dotenv_codegen;

extern crate derive_more;

use actix_web::dev::ServiceRequest;
use actix_web::{http, web, App, Error, HttpServer};

use actix_web_httpauth::extractors::bearer::BearerAuth;
// use actix_web_httpauth::extractors::{AuthenticationError};
use actix_web_httpauth::middleware::HttpAuthentication;

use actix_cors::Cors;
use actix_web_grants::permissions::AttachPermissions;
use std::env;

mod claim;
mod generator;
mod repository;
mod routes;
mod security;
mod ws;
mod configuration;

use crate::routes::get::*;
use crate::routes::post::*;
// use crate::routes::error::*;

async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, Error> {
    match claim::decode_jwt(credentials.token()) {
        Ok(o) => {
            req.attach(o.permissions);
            env::set_var("username", o.username);
            Ok(req)
        }
        Err(e) => Err(e), // Err(e) => Err(CustomError::from(String::from("Invalid authentication ")))
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::from_filename(".env.local").unwrap();

    HttpServer::new(|| {
        let auth = HttpAuthentication::bearer(validator);

        let cors = Cors::default()
            .allow_any_origin()
            .allowed_methods(vec!["GET", "POST"])
            .allowed_headers(vec![
                http::header::AUTHORIZATION,
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(create_token)
            .service(login)
            .service(
                web::scope("/api")
                    .wrap(auth)
                    .service(permission_secured)
                    .service(permission_secured)
                    .service(user_reserved)
                    .service(create_game)
                    .service(crate::routes::post::delete_game)
                    .service(get_game_from_user_id)
                    .service(crate::routes::post::get_player)
                    .service(create_player)
                    .service(crate::routes::post::get_socket_address)
            )
    })
    .bind(dotenv!("API_URL"))?
    .workers(1)
    .run()
    .await
}
