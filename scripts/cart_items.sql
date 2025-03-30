CREATE TABLE cart_items (
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id UUID NOT NULL,
    count integer NOT NULL CHECK (count > 0),
    PRIMARY KEY (cart_id, product_id)
);

CREATE INDEX idx_cart_items_cart_id ON cart_items (cart_id);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
