use crate::{
    auth::verify_bearer,
    database::{LeaderboardListing, UserListing},
};
use actix_web::{post, web, HttpRequest, HttpResponse};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[post("/update_score")]
pub async fn post_update_score(
    db: web::Data<Mutex<Connection>>,
    json: web::Json<LeaderboardListing>,
    req: HttpRequest,
) -> HttpResponse {
    let mut body = json.into_inner();
    if body.score > 999 {
        body.score = 999;
    }
    let Some(token) = req
        .headers()
        .get("Authorization")
        .map(|token| token.to_str().ok())
        .flatten()
    else {
        return HttpResponse::Forbidden().finish();
    };
    if body.puzzle_id > 400 || body.score == 0 {
        return HttpResponse::InternalServerError().finish();
    }
    let email = UserListing::select(body.username.as_str(), &db)
        .unwrap_or_default()
        .email;
    if !verify_bearer(token, email.as_str(), &db) {
        return HttpResponse::Forbidden().finish();
    }
    if let Err(error) = body.replace_score(&db) {
        println!("Leaderboard insertion error: {:?}", error);
        return HttpResponse::InternalServerError().finish();
    }
    if let Err(error) =
        UserListing::update_score(body.username.as_str(), body.puzzle_id, body.score, &db)
    {
        println!("User listing update score error: {:?}", error);
        return HttpResponse::InternalServerError().finish();
    }
    HttpResponse::Ok().finish()
}

#[derive(Debug, Clone, Deserialize)]
pub struct LeaderboardRequest {
    pub puzzle_id: usize,
}

#[derive(Debug, Clone, Serialize)]
pub struct LeaderboardResponse {
    pub scores: Vec<LeaderboardListing>,
}

#[post("/leaderboard")]
pub async fn get_leaderboard(
    json: web::Json<LeaderboardRequest>,
    db: web::Data<Mutex<Connection>>,
) -> HttpResponse {
    let Ok(mut scores) = LeaderboardListing::select(json.into_inner().puzzle_id, &db) else {
        return HttpResponse::InternalServerError().finish();
    };
    scores.sort_by(|a, b| a.score.cmp(&b.score));

    HttpResponse::Ok().json(LeaderboardResponse { scores })
}
