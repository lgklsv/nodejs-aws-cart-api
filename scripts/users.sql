CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
