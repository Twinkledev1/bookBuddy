DROP TABLE IF EXISTS reservation_items;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;


CREATE TABLE users(
    id serial PRIMARY KEY,
    first_name text NOT NULL,
    last_name text NOT NULL, 
    email text NOT NULL,
    password text NOT NULL
 
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title text NOT NULL,
    author text NOT NULL, 
    description text NOT NULL,
    cover_image text NOT NULL, 
    available boolean DEFAULT true
);

CREATE TABLE reservations(
        id serial PRIMARY KEY,
        check_in DATE NOT NULL,
        check_out DATE,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE
     
);

CREATE TABLE reservation_items (
  id serial PRIMARY KEY,
  reservation_id INTEGER NOT NULL REFERENCES reservations (id) ON DELETE CASCADE,
  book_id INTEGER UNIQUE NOT NULL REFERENCES books (id) ON DELETE CASCADE
);