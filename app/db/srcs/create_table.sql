USE twchat;
CREATE TABLE IF NOT EXISTS streamer(
  `id`            int          NOT NULL auto_increment primary key,
  `streamer_id`   VARCHAR(32)  NOT NULL,
  `nick`          VARCHAR(32)  NOT NULL,
  `image_url`     VARCHAR(256) NOT NULL,
);
CREATE TABLE IF NOT EXISTS chatlog(
  `streamer_id`   VARCHAR(32)   NOT NULL,
  `date`          TIMESTAMP     DEFAULT NOW(),
  `user_id`       VARCHAR(32)   NOT NULL,
  `content`       VARCHAR(256)
);
