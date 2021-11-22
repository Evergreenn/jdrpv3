use actix_web::dev::ServiceRequest;
use actix_web::{http, web, App, Error, HttpServer};

use actix_web_httpauth::extractors::bearer::BearerAuth;
use actix_web_httpauth::middleware::HttpAuthentication;

use actix_cors::Cors;
use actix_web_grants::permissions::AttachPermissions;

mod claim;
mod routes;
mod repository;
mod security;

use crate::routes::get::*;
use crate::routes::post::*;

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
        .service(login)
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