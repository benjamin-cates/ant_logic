use crate::database::UserListing;
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
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

#[derive(Debug, Clone, Deserialize)]
pub struct UpdateOwnershipRequest {
    pub username: String,
    pub owned_vals: Vec<usize>,
    pub currency: usize,
}

#[post("/user_update_ownership")]
pub async fn post_user_update_ownership(
    db: web::Data<Mutex<Connection>>,
    json: web::Json<UpdateOwnershipRequest>,
    req: HttpRequest,
) -> HttpResponse {
    let body = json.into_inner();
    let Some(token) = req
        .headers()
        .get("Authorization")
        .map(|token| token.to_str().ok())
        .flatten()
    else {
        return HttpResponse::Forbidden().finish();
    };
    let email = UserListing::select(body.username.as_str(), &db)
        .unwrap_or_default()
        .email;
    if !crate::auth::verify_bearer(token, email.as_str(), &db) {
        return HttpResponse::Forbidden().finish();
    }
    if let Err(error) =
        UserListing::update_ownership(body.username.as_str(), body.currency, &body.owned_vals, &db)
    {
        println!("Error in update owned vals: {:?}", error);
        return HttpResponse::InternalServerError().finish();
    }
    HttpResponse::Ok().finish()
}
