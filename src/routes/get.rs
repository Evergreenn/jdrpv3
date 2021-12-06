use actix_web::{get, web, HttpResponse, Responder};
use actix_web_grants::proc_macro::{has_any_role, has_permissions};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use crate::claim::decode_jwt;
use crate::repository::manage::*;


#[get("/admin")]
#[has_permissions("OP_GET_SECURED_INFO")]
async fn permission_secured() -> HttpResponse {
    HttpResponse::Ok().finish()
}

#[has_any_role("ADMIN", "MANAGER", "USER")]
#[get("/ping")]
async fn user_reserved() -> HttpResponse {
    HttpResponse::Ok().finish()
}

#[get("/manager")]
#[has_any_role("ADMIN", "MANAGER")]
async fn manager_secured() -> HttpResponse {
    HttpResponse::Ok().finish()
}


#[has_any_role("ADMIN", "MDJ", "USER")]
#[get("/get-user-game")]
pub async fn get_game_from_user_id(credentials: BearerAuth)-> impl Responder{

    let t = decode_jwt(credentials.token()).unwrap();

    let game = get_game(&t.user_id);
    web::Json(game)

}
