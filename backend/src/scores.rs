use crate::{auth::verify_bearer, database::LeaderboardListing};
use actix_web::{get, post, web, HttpRequest, HttpResponse};
use rusqlite::Connection;
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[post("/update_score")]
pub async fn post_update_score(
    db: web::Data<Mutex<Connection>>,
    json: web::Json<LeaderboardListing>,
    req: HttpRequest,
) -> HttpResponse {
    let body = json.into_inner();
    println!("{:?}", req.headers().get("Authorization"));
    let Some(token) = req
        .headers()
        .get("Authorization")
        .map(|token| token.to_str().ok())
        .flatten()
    else {
        return HttpResponse::Forbidden().finish();
    };
    if !verify_bearer(token, body.username.as_str(), &db) {
        return HttpResponse::Forbidden().finish();
    }
    let _ = body.replace_score(&db);
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

#[get("/leaderboard")]
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
