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
  platformConstructor VARCHAR(100) NULL
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200),
  yearofrelease INTEGER NULL,
  idapi VARCHAR(10) NOT NULL
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

INSERT INTO platforms (name, platformconstructor) VALUES
('DVD', 'Various'),
('Blu-Ray', 'Various'),
('Blu-Ray 4K', 'Various'),
('PlayStation', 'Sony'),
('PlayStation 2', 'Sony'),
('PlayStation 3', 'Sony'),
('PlayStation 4', 'Sony'),
('PlayStation 5', 'Sony'),
('PSP', 'Sony'),
('PlayStation Vita', 'Sony'),
('Nintendo Entertainment System', 'Nintendo'),
('Super Nintendo', 'Nintendo'),
('Nintendo 64', 'Nintendo'),
('GameCube', 'Nintendo'),
('Wii', 'Nintendo'),
('Wii U', 'Nintendo'),
('Switch', 'Nintendo'),
('Game Boy', 'Nintendo'),
('Game Boy Advance', 'Nintendo'),
('Nintendo DS', 'Nintendo'),
('Nintendo 3DS', 'Nintendo'),
('Xbox', 'Microsoft'),
('Xbox 360', 'Microsoft'),
('Xbox One', 'Microsoft'),
('Xbox Series X', 'Microsoft'),
('Master System', 'Sega'),
('Genesis', 'Sega'),
('Sega CD', 'Sega'),
('32X', 'Sega'),
('Saturn', 'Sega'),
('Dreamcast', 'Sega'),
('Game Gear', 'Sega'),
('Lynx', 'Atari'),
('Jaguar', 'Atari');
