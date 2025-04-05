CREATE TYPE OrderStatus AS ENUM ('OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED');


CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    cart_id UUID NOT NULL,
    items JSONB NOT NULL,
    payment JSONB NOT NULL,
    delivery JSONB NOT NULL,
    comments VARCHAR(255) NOT NULL,
    status OrderStatus DEFAULT 'OPEN' NOT NULL,
    total INTEGER NOT NULL,
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
