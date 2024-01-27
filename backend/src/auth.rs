use crate::database::{self, TokenListing};
use actix_web::{
    cookie::{time::Duration, Cookie},
    post, web, HttpResponse,
};
use fireauth;
use rusqlite::Connection;
use serde::Deserialize;
use std::sync::Mutex;

pub struct AuthData(fireauth::FireAuth);

pub fn get_auth_init() -> AuthData {
    let api_key: String = String::from(include_str!("api_key.txt"));
    AuthData(fireauth::FireAuth::new(api_key))
}

pub fn verify_bearer(bearer: &str, email: &str, db: &Mutex<Connection>) -> bool {
    let Some(real_token) = TokenListing::select(email.to_owned(), db) else {
        return false;
    };
    return "Bearer ".to_owned() + &real_token.token == bearer;
}

#[derive(Deserialize)]
struct SignUpRequest {
    pub email: String,
    pub username: String,
    pub password: String,
}

#[post("/sign_up")]
pub async fn post_signup(
    db: web::Data<Mutex<Connection>>,
    json: web::Json<SignUpRequest>,
    auth: web::Data<AuthData>,
) -> HttpResponse {
    let user = json.into_inner();
    let response = match auth
        .0
        .sign_up_email(user.email.as_str(), user.password.as_str(), true)
        .await
    {
        Ok(response) => response,
        Err(error) => {
            println!("sign up error: {:?}", error);
            return HttpResponse::Forbidden().body(format!("{:?}", error));
        }
    };
    let token = response.refresh_token;
    if (database::TokenListing {
        email: user.email.clone(),
        token: token.clone(),
    })
    .push_to_db(&db)
    .is_err()
    {
        println!("failed to insert token");
        return HttpResponse::InternalServerError().finish();
    }
    if (database::UserListing {
        username: user.username.clone(),
        email: user.email.clone(),
        ..Default::default()
    })
    .push_to_db(&db)
    .is_err()
    {
        println!("failed to insert user");
        return HttpResponse::InternalServerError().finish();
    }
    HttpResponse::Ok().body(token)
}

#[derive(Deserialize)]
struct SignInRequest {
    pub email: String,
    pub password: String,
}

#[post("/login")]
pub async fn post_login(
    db: web::Data<Mutex<Connection>>,
    json: web::Json<SignInRequest>,
    auth: web::Data<AuthData>,
) -> HttpResponse {
    let user = json.into_inner();
    let Ok(response) = auth
        .0
        .sign_in_email(user.email.as_str(), user.password.as_str(), true)
        .await
    else {
        return HttpResponse::Forbidden().finish();
    };
    let token = match response.refresh_token {
        Some(thing) => thing,
        None => {
            return HttpResponse::Forbidden().finish();
        }
    };
    if (database::TokenListing {
        email: user.email,
        token: token.clone(),
    })
    .push_to_db(&db)
    .is_err()
    {
        return HttpResponse::Forbidden().finish();
    }
    HttpResponse::Ok().body(token)
}
