CREATE TABLE IF NOT EXISTS users (
 id serial primary key,
 username character varying(255) NOT NULL,
 password character varying(255) NOT NULL
);

INSERT INTO users (username, password) VALUES ('admin', '$2a$11$pgj3.zySyFOvIQEpD7W6Aund1Tw.BFarXxgLJxLbrzIv/4Nteisii');

CREATE TABLE IF NOT EXISTS flights(
  flightID varchar(10),
  arrDepBool varchar(1) not null,
  origin varchar(128) not null,
  status varchar(400) not null,
  scheduled TIMESTAMP,
  estimated TIMESTAMP,
  gate varchar(4),
  finished boolean,
  PRIMARY KEY(flightID, arrDepBool)
);