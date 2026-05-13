SET ROLE TO admin;

CREATE TABLE user_ratings (
  id int UNIQUE NOT NULL,
  rating double precision NOT NULL CHECK (rating >= 0.0 AND rating <= 10.0),
  PRIMARY KEY (id)
);
