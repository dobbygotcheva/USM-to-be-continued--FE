use actix_cors::Cors;
use actix_web::{App, HttpServer};

mod models;
mod handlers;
mod services;
mod utils;

extern crate actix_web;

use handlers::{
    index, get_users, get_students, get_teachers, get_departments, get_department, new_department, 
    invite_to_department, kick_from_department, get_courses, get_course, new_course, update_course, 
    remove_course, update_user, delete_user, get_self, self_alias, update_self, admin, enroll, 
    unenroll, login, logout, register, register_admin, get_stats
};

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let http_server = HttpServer::new(|| {
        App::new()
            .wrap(Cors::permissive())
            .service(index)
            .service(get_users)
            .service(get_students)
            .service(get_teachers)
            .service(get_departments)
            .service(get_department)
            .service(new_department)
            .service(invite_to_department)
            .service(kick_from_department)
            .service(get_courses)
            .service(get_course)
            .service(new_course)
            .service(update_course)
            .service(remove_course)
            .service(update_user)
            .service(delete_user)
            .service(get_self)
            .service(self_alias)
            .service(update_self)
            .service(admin)
            .service(enroll)
            .service(unenroll)
            .service(login)
            .service(logout)
            .service(register)
            .service(register_admin)
            .service(get_stats)
    })
    .bind(("127.0.0.1", 8081))?;

    http_server.run().await
} 