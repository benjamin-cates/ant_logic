use actix_web::{web::Data, App, HttpServer};
mod auth;
mod database;
mod scores;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_web=trace");
    env_logger::init();
    let db = database::open_connection();
    let db_data = Data::new(db);
    let auth = auth::get_auth_init();
    let auth_data = Data::new(auth);
    println!("Hosting on localhost:8001");
    HttpServer::new(move || {
        App::new()
            .service(auth::post_signup)
            .service(auth::post_login)
            .service(scores::post_update_score)
            .app_data(Data::clone(&db_data))
            .app_data(Data::clone(&auth_data))
    })
    .bind(("127.0.0.1", 8001))?
    .run()
    .await?;
    return Ok(());
}
