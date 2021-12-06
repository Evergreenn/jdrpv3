CREATE TABLE IF NOT EXISTS game (
    game_id VARCHAR(50) PRIMARY KEY,
    game_name VARCHAR(255) NOT NULL,
    game_password VARCHAR(255) NOT NULL,
    creator_id VARCHAR(50) NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    game_slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)  ENGINE=INNODB;