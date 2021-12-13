USE twchat;
CREATE TABLE IF NOT EXISTS streamer(
  `id`            int          NOT NULL auto_increment UNIQUE KEY,
  `streamer_id`   VARCHAR(32)  NOT NULL PRIMARY KEY,
  `nick`          VARCHAR(32)  NOT NULL,
  `image_url`     VARCHAR(256) NOT NULL
);

CREATE TABLE IF NOT EXISTS chatlog(
  `streamer_id`   VARCHAR(32),
  `date`          TIMESTAMP    DEFAULT NOW(),
  `user_id`       VARCHAR(32)  NOT NULL,
  `content`       VARCHAR(256),
  FOREIGN KEY (streamer_id) REFERENCES streamer(streamer_id) ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS chatfire(
  `id`            int          NOT NULL auto_increment PRIMARY KEY,
  `streamer_id`   VARCHAR(32),
  `date`          TIMESTAMP    NOT NULL,
  `count`         int,
  FOREIGN KEY (streamer_id) REFERENCES streamer(streamer_id) ON UPDATE CASCADE
);
