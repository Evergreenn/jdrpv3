use actix_web::dev::ServiceRequest;
use actix_web::{http, post, web, App, Error, HttpServer};

use actix_web_httpauth::extractors::bearer::BearerAuth;
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::Deserialize;

use crate::claim::Claims;
use actix_cors::Cors;
use actix_web_grants::permissions::AttachPermissions;

mod claim;
mod routes;

use crate::routes::get::*;

async fn validator(req: ServiceRequest, credentials: BearerAuth) -> Result<ServiceRequest, Error> {
    let claims = claim::decode_jwt(credentials.token())?;
    req.attach(claims.permissions);
    Ok(req)
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
        .service(
            web::scope("/api")
                .wrap(auth)
                .service(permission_secured)
                .service(permission_secured)
                .service(user_reserved),
        )
    })
    .bind("127.0.0.1:8081")?
    .workers(1)
    .run()
    .await
}

#[post("/token")]
pub async fn create_token(info: web::Json<UserInput>) -> Result<String, Error> {
    let user_info = info.into_inner();

    //TODO: check user information in database

    let user_permissions = vec!["OP_GET_SECURED_INFO".to_string(), "ROLE_USER".to_string()];

    let claims = Claims::new(user_info.username, user_permissions);
    let jwt = claim::create_jwt(claims)?;

    Ok(jwt)
}

#[derive(Deserialize)]
pub struct UserInput {
    pub username: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct UserPermissions {
    pub username: String,
    pub permissions: Vec<String>,
}
