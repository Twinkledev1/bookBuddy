DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS books;


CREATE TABLE users(
    id serial PRIMARY KEY,
    firstname text NOT NULL,
    lastname text NOT NULL, 
    email text NOT NULL,
    password text NOT NULL,
    UNIQUE (email)
);

CREATE TABLE books(
    id serial PRIMARY KEY,
    title text NOT NULL,
    author text NOT NULL, 
    description text NOT NULL,
    coverImage text NOT NULL, 
    available boolean DEFAULT true
);

CREATE TABLE reservations(
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        book_id integer NOT NULL REFERENCES books(id) on DELETE CASCADE,
        UNIQUE (user_id, book_id)
);