use actix_web::{get, web, Responder};
use actix_web_grants::proc_macro::{has_any_role};
use actix_web_httpauth::extractors::bearer::BearerAuth;
use crate::claim::decode_jwt;
use crate::repository::manage::*;
use serde::{Deserialize};

#[derive(Deserialize)]
pub struct Pagination {
    page: u16
}


// #[get("/admin")]
// #[has_permissions("OP_GET_SECURED_INFO")]
// async fn permission_secured() -> HttpResponse {
//     HttpResponse::Ok().finish()
// }

#[has_any_role("ADMIN", "MDJ", "USER")]
#[get("/get-user-game")]
pub async fn get_game_from_user_id(credentials: BearerAuth, pagination: web::Query<Pagination>)-> impl Responder{

    let t = decode_jwt(credentials.token()).unwrap();

    let game = get_game(&t.user_id, pagination.page);
    web::Json(game)

}

#[has_any_role("ADMIN", "MDJ", "USER")]
#[get("/get-user-game-counted")]
pub async fn get_count_game_from_user_id(credentials: BearerAuth)-> impl Responder{

    let t = decode_jwt(credentials.token()).unwrap();

    let game = get_count_game(&t.user_id).unwrap_or(0);

    // match game {
    //     Some(e) => e,
    //     None => 0
    // };

    web::Json(game)

}
