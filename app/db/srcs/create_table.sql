-- # streamer_id : 123456
-- # streamer_login -> streamer_login : zilioner
-- # nick : 침착맨

USE twchat;
CREATE TABLE IF NOT EXISTS streamer(
  `id`                  INT          NOT NULL auto_increment UNIQUE KEY,
  `streamer_id`         VARCHAR(32)  NOT NULL,
  `streamer_login`      VARCHAR(32)  NOT NULL PRIMARY KEY,
  `nick`                VARCHAR(32)  NOT NULL,
  `image_url`           VARCHAR(256) NOT NULL,
  `on_air`              TINYINT(1),
  `viewers`             INT,
  `followers`           INT
);

CREATE TABLE IF NOT EXISTS chatlog(
  `streamer_id`         VARCHAR(32),
  `date`                TIMESTAMP    DEFAULT NOW(),
  `content`             VARCHAR(256)
);

CREATE TABLE IF NOT EXISTS chatfire(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
  `date`                TIMESTAMP    NOT NULL,
  `count`               int
);

CREATE TABLE IF NOT EXISTS legend(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
  `chatfire_id`         int          NOT NULL,
  `last_update_date`    TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS topword(
  `id`                  int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
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
  `top10`               VARCHAR(16)
);

ALTER TABLE topword CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
