use actix_web::dev::ServiceRequest;
use actix_web::{http, get, post, web, App, Error, HttpResponse, HttpServer};

use actix_web_httpauth::extractors::bearer::BearerAuth;
use actix_web_httpauth::middleware::HttpAuthentication;
use serde::Deserialize;

use actix_web_grants::proc_macro::{has_any_role, has_permissions};
// Used for integration with `actix-web-httpauth`
use actix_web_grants::permissions::AttachPermissions;
use actix_cors::Cors;
use crate::claim::Claims;

mod claim;

#[get("/admin")]
#[has_permissions("OP_GET_SECURED_INFO")]
async fn permission_secured() -> HttpResponse {
    HttpResponse::Ok().finish()
}

#[get("/manager")]
#[has_any_role("ADMIN", "MANAGER")]
async fn manager_secured() -> HttpResponse {
    HttpResponse::Ok().finish()
}

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
        // .send_wildcard()
        .allowed_methods(vec!["GET", "POST"])
        .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT, http::header::CONTENT_TYPE])
        .max_age(3600);

        App::new()
        .wrap(cors)
        .service(create_token).service(
            web::scope("/api")
                .wrap(auth)
                .service(permission_secured)
                .service(manager_secured),
        )
    })
    .bind("127.0.0.1:8081")?
    .workers(1)
    .run()
    .await
}

#[post("/token")]
pub async fn create_token(info: web::Json<UserPermissions>) -> Result<String, Error> {
    let user_info = info.into_inner();
    let claims = Claims::new(user_info.username, user_info.permissions);
    let jwt = claim::create_jwt(claims)?;

    Ok(jwt)
}

#[derive(Deserialize)]
pub struct UserPermissions {
    pub username: String,
    pub permissions: Vec<String>,
}
