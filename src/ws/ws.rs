use std::net::TcpListener;
use std::net::{IpAddr, Ipv4Addr, SocketAddr};

pub(crate) fn get_free_socket_address() -> String{
    let port = get_available_port();

    let socket = SocketAddr::new(IpAddr::V4(Ipv4Addr::new(127, 0, 0, 1)), port.unwrap());
    socket.to_string()
}


fn get_available_port() -> Option<u16> {
    (49152..65535).find(
        |port |port_is_available(*port)
    )
}

fn port_is_available(port: u16) -> bool {
    match TcpListener::bind(("127.0.0.1", port)) {
        Ok(_) => true,
        Err(_) => false,
    }
}