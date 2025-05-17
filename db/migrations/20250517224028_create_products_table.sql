-- migrate:up

CREATE TABLE products (
    id INTEGER SERIAL PRIMARY KEY,
    price FLOAT NOT NULL,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    available_items integer,
    created_at TIMESTAMP DEFAULT now(),
)