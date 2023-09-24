CREATE DATABASE datageekv2;

CREATE TABLE userdg (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  name VARCHAR(255),
  surname VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE platforms (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  constructor VARCHAR(100) NULL
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  publisher VARCHAR(100) NULL,
  yearofrelease INTEGER NULL
);

CREATE TABLE user_media (
  userdg_id INTEGER REFERENCES userdg(id),
  media_id INTEGER REFERENCES media(id),
  PRIMARY KEY (userdg_id, media_id)
);

CREATE TABLE user_platforms (
  userdg_id INTEGER REFERENCES userdg(id),
  platform_id INTEGER REFERENCES platforms(id),
  PRIMARY KEY (userdg_id, platform_id)
);

CREATE TABLE media_platforms (
  media_id INTEGER REFERENCES media(id),
  platform_id INTEGER REFERENCES platforms(id),
  PRIMARY KEY (media_id, platform_id)
);