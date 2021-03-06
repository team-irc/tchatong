-- # streamer_id : 123456
-- # streamer_login -> streamer_login : zilioner
-- # nick : 침착맨

USE twchat;
CREATE TABLE IF NOT EXISTS streamer(
  `id`                  INT          NOT NULL auto_increment UNIQUE KEY,
  `streamer_id`         VARCHAR(32)  NOT NULL PRIMARY KEY,
  `streamer_login`      VARCHAR(32)  NOT NULL,
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
  `id`                  INT          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
  `date`                TIMESTAMP    NOT NULL,
  `count`               INT,
  `viewers`             INT
);

CREATE TABLE IF NOT EXISTS legend(
  `id`                  INT          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
  `chatfire_id`               INT          NOT NULL,
  `last_update_date`    TIMESTAMP    NOT NULL
);

CREATE TABLE IF NOT EXISTS topword(
  `id`                  INT          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`         VARCHAR(32),
  `date`                TIMESTAMP    NOT NULL,
  `top1`                VARCHAR(16),
  `top1_count`          INT,
  `top2`                VARCHAR(16),
  `top2_count`          INT,
  `top3`                VARCHAR(16),
  `top3_count`          INT,
  `top4`                VARCHAR(16),
  `top4_count`          INT,
  `top5`                VARCHAR(16),
  `top5_count`          INT,
  `top6`                VARCHAR(16),
  `top6_count`          INT,
  `top7`                VARCHAR(16),
  `top7_count`          INT,
  `top8`                VARCHAR(16),
  `top8_count`          INT,
  `top9`                VARCHAR(16),
  `top9_count`          INT,
  `top10`               VARCHAR(16)
  `top10_count`          INT,
);

ALTER TABLE topword CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
