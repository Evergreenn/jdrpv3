use actix_web::{get, HttpResponse};
use actix_web_grants::proc_macro::{has_any_role, has_permissions};

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
