DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    picture VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id),
    url VARCHAR NOT NULL,
    title VARCHAR,
    description TEXT,
    tags TEXT,
    likes INT,
    comments INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- USERS
INSERT INTO users (name, email, password, picture) VALUES (
    'admin',
    'admin@email.com',
    '12345',
    'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E'
);

-- IMAGES
INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1560517961-1cdc66f62d3f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    'Rhino',
    'A majestic animal that might disappear because of us.',
    'nature animals',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1663856542320-639f788ac5b8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2864&q=80',
    'Forest',
    'A long and myterious road navigates through the forest.',
    'nature roads',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/uploads/1413135232798a43d1442/79e54635?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2940&q=80',
    'Road',
    'The long journey awaits.',
    'nature roads',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1665174199427-d99483290649?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2688&q=80',
    'Yellowstone',
    'The most famous geyser in the world.',
    'nature yellowstone',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1665250998590-d222b025f3b3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2864&q=80',
    'Mountain',
    'Few have reached this natural sanctuary.',
    'nature',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1665165154115-4a0515fd2347?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2942&q=80',
    'Antelope Canyon',
    'The footprint of millions of years.',
    'nature',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1665341896132-246ad12da06b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2487&q=80',
    'Desert',
    'The dunes seem still but are very much alive.',
    'nature',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1665093065096-3aed209239e1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2487&q=80',
    'Trees',
    'The leaves cover the skies.',
    'nature',
    '0',
    '0'
);

INSERT INTO images (user_id, url, title, description, tags, likes, comments) VALUES (
    '1',
    'https://images.unsplash.com/photo-1664892378945-6a95d2fe538a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2384&q=80',
    'Giraffes',
    'Giraffes drinking water.',
    'nature animals',
    '0',
    '0'
);
