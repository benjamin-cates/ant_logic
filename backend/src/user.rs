use crate::database::UserListing;
use actix_web::{get, web, HttpResponse};
use rusqlite::Connection;
use serde::Serialize;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize)]
pub struct UserResponse {
    pub username: String,
    pub scores: Vec<usize>,
    pub owned_vals: Vec<usize>,
    pub currency: usize,
}

#[get("/user/{username}")]
pub async fn get_user(
    path: web::Path<(String,)>,
    db: web::Data<Mutex<Connection>>,
) -> HttpResponse {
    let (name,) = path.into_inner();
    let Some(user) = UserListing::select(name.as_str(), &db) else {
        println!("Cannot find user {:?}", name);
        return HttpResponse::NotFound().finish();
    };
    HttpResponse::Ok().json(UserResponse {
        username: user.username,
        scores: user.scores,
        owned_vals: user.owned_vals,
        currency: user.currency,
    })
}
