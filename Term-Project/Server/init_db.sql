DROP TABLE IF EXISTS userlist;
CREATE TABLE IF NOT EXISTS userlist (
    ID int NOT NULL AUTO_INCREMENT,
    username varchar(30),
    pwd_hash char(60),
    api_key_name char(60),
    api_key_hash char(60),
    admin_account BOOLEAN,
    PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS apiKeys;
CREATE TABLE IF NOT EXISTS apiKeys (
    api_key_name char(20),
    api_key_hash char(60),
    PRIMARY KEY (api_key_name)
);

DROP TABLE IF EXISTS color_changes;
CREATE TABLE IF NOT EXISTS color_changes (
    api_key_name char(20),
    server_time char(32),
    PRIMARY KEY (api_key_name)
);

DROP TABLE IF EXISTS color_choice;
CREATE TABLE IF NOT EXISTS color_choice (
    api_key_name char(20),
    color_choice char(1),
    PRIMARY KEY (api_key_name)
);

DROP TABLE IF EXISTS map;
CREATE TABLE IF NOT EXISTS map (
    ID int NOT NULL,
    map varchar(1000),
    PRIMARY KEY (ID)
);

DROP TABLE IF EXISTS score;
CREATE TABLE IF NOT EXISTS score (
    ID int NOT NULL,
    red_score int NOT NULL,
    blue_score int NOT NULL,
    yellow_score int NOT NULL,
    green_score int NOT NULL,
    PRIMARY KEY (ID)
);