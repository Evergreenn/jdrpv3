use super::pool::mysql_connection;
use mysql::prelude::*;
use mysql::params;
use serde::Serialize;
use uuid::Uuid;
use crate::Cst;
use chrono::NaiveDateTime;
use std::option;
// mod routes;

// use routes::post::Cst;

#[derive(Serialize)]
struct Permissions {
    permissions: Vec<String>
}

#[derive(Debug, PartialEq, Eq)]
pub struct User {
    pub user_id: String,
    pub username: String,
    pub password: String,
    pub user_permissions: String
}


#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct Player {
    pub player_id: String,
    pub player_cs: String
}

#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct PlayerInsert {
    pub player_id: String,
    pub game_id: String,
    pub creator_id: String,
    pub player_cs: String
}


#[derive(Debug, PartialEq, Eq)]
pub struct Game {
    pub game_id: String,
    pub game_name: String,
    pub game_password: String,
    pub creator_id: String,
    pub game_type: String,
    pub game_slug: String
}


#[derive(Serialize, Debug, PartialEq, Eq)]
pub struct GamePublic {
    pub game_id: String,
    pub game_name: String,
    pub game_type: String,
    pub game_slug: String,
    pub created_at: NaiveDateTime
}


pub fn insert_new_user(username: &String, password: String, permissions: Vec<String>) -> Result<std::string::String,  Box<dyn std::error::Error>> {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let perm_json = serde_json::to_string(&Permissions {
        permissions: permissions
    }).unwrap();

    let user_id = Uuid::new_v4();    

    let user = User {
        user_id: user_id.to_string(),
        username: username.to_string(),
        password,
        user_permissions: perm_json
    };

    //TODO: AddLog
    // println!("{:#?}", user);

    //TODO: check error value here
    conn.exec_iter(
        r"INSERT INTO user (user_id, username, password, user_permissions) VALUES (:user_id, :username, :password, :user_permissions);",
        params! {
            "user_id" => user.user_id,
            "username" => user.username,
            "password" => user.password,
            "user_permissions" => user.user_permissions,
        },
    )
    .unwrap();

    Ok(user_id.to_string())
}


pub fn insert_new_player(creator_id: String, game_id: String, player_cs: String) -> Result<std::string::String,  Box<dyn std::error::Error>> {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let player_id = Uuid::new_v4();

    let player = PlayerInsert {
        player_id: player_id.to_string(),
        game_id,
        creator_id,
        player_cs
    };

    //TODO: AddLog
    // println!("{:#?}", user);

    //TODO: check error value here
    conn.exec_iter(
        r"INSERT INTO player (player_id, game_id, creator_id, player_cs) VALUES (:player_id, :game_id, :creator_id, :player_cs);",
        params! {
            "player_id" => player.player_id,
            "game_id" => player.game_id,
            "creator_id" => player.creator_id,
            "player_cs" => player.player_cs,
        },
    )
    .unwrap();

    Ok(player_id.to_string())
}

pub fn insert_new_game(game_name: String, game_password: String, creator_id: String, game_type: Cst, game_slug: &String,) -> String {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let game_id = Uuid::new_v4().to_string();
    let ro = game_id.clone();

    let game_slug = game_slug.to_string();

    let game_type = game_type.to_string();

    let game = Game {
        game_id,
        game_name,
        game_password,
        creator_id,
        game_type,
        game_slug
    };
    //TODO: check error value here
    conn.exec_iter(
        r"INSERT INTO game (
            game_id,
            game_name,
            game_password,
            creator_id,
            game_type,
            game_slug
        ) VALUES (
            :game_id,
            :game_name,
            :game_password,
            :creator_id,
            :game_type,
            :game_slug
        );",
        params! {
            "game_id" => game.game_id,
            "game_name" => game.game_name,
            "game_password" => game.game_password,
            "creator_id" => game.creator_id,
            "game_type" => game.game_type,
            "game_slug" => game.game_slug,
        },
    )
    .unwrap();

    ro
}

pub fn get_user(username: &String)-> Vec<User> {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let ret = conn.exec_map(
        "SELECT user_id, username, password, user_permissions FROM user WHERE username=:user_name;", 
        params!{
            "user_name" => username
        }, 
    |(user_id, username, password, user_permissions)| {
        User{user_id, username, password, user_permissions}
    }).unwrap();

    ret
}

pub fn get_player(user_id: String, game_id: String) -> Option<Player> {

    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    println!("SELECT player_id, player_cs FROM player WHERE creator_id ={} AND game_id ={};", user_id, game_id);

    let mut ret = conn.exec_map(
        "SELECT player_id, player_cs FROM player WHERE creator_id =:user_id AND game_id =:game_id;", 
        params!{
            user_id,
            game_id
        }, 
    |(player_id, player_cs)| {
        Player{player_id, player_cs}
    }).unwrap();

    if ret.is_empty(){
        None
    }else {
        let mut one = ret.drain(0..1);
        one.next()
    }

}

pub fn get_game(user_id: &String)-> Vec<GamePublic> {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    let ret = conn.exec_map(
        "SELECT game_id, game_name, game_type, game_slug, created_at FROM game WHERE creator_id=:user_id;", 
        params!{
            "user_id" => user_id
        }, 
    |(game_id, game_name, game_type, game_slug, created_at)| {
        GamePublic{game_id, game_name, game_type, game_slug, created_at}
    }).unwrap();

    ret
}

pub fn delete_game(game_id: &String)-> bool {
    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();

    conn.exec_drop(
        "DELETE FROM game WHERE game_id=:game_id;", 
        params!{
            "game_id" => game_id.to_string()
        }).unwrap();

    true
}

pub fn get_socket_address(game_id: &String) -> Option<String> {

    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();
 
    let ret: Option<String> = conn.exec_first(
        "SELECT game_slug FROM game WHERE game_id=:game_id;", 
        params!{
            "game_id" => game_id.to_string()
        }).unwrap();

        println!("socket address retrive from db: {:#?} with game id: {}", ret, game_id);

        ret
}

pub fn is_user_creator_of_game(user_id: String, game_id: &String) -> Option<u8> {

    let pool = mysql_connection();
    let mut conn = pool.get_conn().unwrap();
 
    let ret: Option<u8> = conn.exec_first(
        "SELECT 1 FROM game WHERE creator_id=:user_id AND game_id=:game_id;", 
        params!{
            "user_id" => user_id,
            "game_id" => game_id.to_string()
        }).unwrap();

        ret
}