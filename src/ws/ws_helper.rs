use std::net::TcpListener;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};

pub(crate) fn get_free_socket_address(game_id: &String) -> String {
    //TODO: Check if redis contain a game with id. There should be an address inside if MJ has already started the game
    
    let mut client = redis::Client::open(dotenv!("REDIS_DSN")).unwrap().get_connection().unwrap();
    
    let ws: Option<String> = redis::cmd("HGET")
        .arg(game_id)
        .arg("ws_address")
        .query(&mut client)
        .unwrap();

    println!("socket address from redis: {:#?}",  ws);

    match ws {
        Some(e) => {
            e
        },
        None => {
            let port = get_available_port();
            let socket = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), port.unwrap());
            socket.to_string()
        }
    }
}

pub(crate) fn get_socket_for_player(game_id: &String) -> Option<String> {
    
    let mut client = redis::Client::open(dotenv!("REDIS_DSN")).unwrap().get_connection().unwrap();
    
    let ws: Option<String> = redis::cmd("HGET")
        .arg(game_id)
        .arg("ws_address")
        .query(&mut client)
        .unwrap();

    println!("socket address from redis: {:#?}",  ws);

    ws
}



fn get_available_port() -> Option<u16> {
    (49152..65535).find(|port| port_is_available(*port))
}

fn port_is_available(port: u16) -> bool {
    TcpListener::bind(("127.0.0.1", port)).is_ok()
}


