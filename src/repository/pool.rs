use mysql::*;

pub fn mysql_connection() -> Pool {
    let url = "mysql://root:root@127.0.0.1:3306/animasola";
    let ops = Opts::from_url(url).unwrap();
    Pool::new(ops).unwrap()
}