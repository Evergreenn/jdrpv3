use super::pool::mysql_connection;
use mysql::prelude::*;
use mysql::params;
use serde::Serialize;

#[derive(Serialize)]
struct Permissions {
    permissions: Vec<String>
}

#[derive(Debug, PartialEq, Eq)]
pub struct User {
    pub username: String,
    pub password: String,
    pub user_permissions: String
}


pub fn insert_new_user(username: &String, password: String, permissions: Vec<String>) -> bool {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let perm_json = serde_json::to_string(&Permissions {
        permissions: permissions
    }).unwrap();

    let user = User {
        username: username.to_string(),
        password,
        user_permissions: perm_json
    };

    //TODO: AddLog
    // println!("{:#?}", user);

    //TODO: check error value here
    conn.exec_iter(
        r"INSERT INTO user (username, password, user_permissions) VALUES (:username, :password, :user_permissions);",
        params! {
            "username" => user.username,
            "password" => user.password,
            "user_permissions" => user.user_permissions,
        },
    )
    .unwrap();

    true
}

pub fn get_user(username: &String)-> Vec<User> {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let ret = conn.exec_map(
        "SELECT username, password, user_permissions FROM user WHERE username=:user_name;", 
        params!{
            "user_name" => username
        }, 
    |(username, password, user_permissions)| {
        User{username, password, user_permissions}
    }).unwrap();

    ret
}  