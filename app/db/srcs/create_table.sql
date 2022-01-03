-- # streamer_id : 123456
-- # streamer_login -> streamer_login : zilioner
-- # nick : 침착맨

USE twchat;
CREATE TABLE IF NOT EXISTS streamer(
  `id`                  int          NOT NULL auto_increment UNIQUE KEY,
  `streamer_id`         VARCHAR(32)  NOT NULL,
  `streamer_login`      VARCHAR(32)  NOT NULL PRIMARY KEY,
  `nick`                VARCHAR(32)  NOT NULL,
  `image_url`           VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS chatlog(
  `streamer_login`      VARCHAR(32),
  `date`                TIMESTAMP    DEFAULT NOW(),
  `user_id`             VARCHAR(32)  NOT NULL,
  `content`             VARCHAR(256),
  FOREIGN KEY (streamer_login) REFERENCES streamer(streamer_login) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chatfire(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_login`      VARCHAR(32),
  `date`                TIMESTAMP    NOT NULL,
  `count`               int,
  FOREIGN KEY (streamer_login) REFERENCES streamer(streamer_login) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS legend(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_login`      VARCHAR(32),
  `chatfire_id`         int          NOT NULL,
  `last_update_date`    TIMESTAMP    NOT NULL,
  FOREIGN KEY (streamer_login) REFERENCES streamer(streamer_login) ON UPDATE CASCADE,
  FOREIGN KEY (chatfire_id) REFERENCES chatfire(id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS topword(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_login`      VARCHAR(32),
  `date`                TIMESTAMP    NOT NULL,
  `top1`                VARCHAR(16),
  `top2`                VARCHAR(16),
  `top3`                VARCHAR(16),
  `top4`                VARCHAR(16),
  `top5`                VARCHAR(16),
  `top6`                VARCHAR(16),
  `top7`                VARCHAR(16),
  `top8`                VARCHAR(16),
  `top9`                VARCHAR(16),
  `top10`               VARCHAR(16),
  FOREIGN KEY (streamer_login) REFERENCES streamer(streamer_login) ON UPDATE CASCADE
);
