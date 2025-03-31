INSERT INTO carts (user_id, status) VALUES
(uuid_generate_v4(), 'OPEN'),
(uuid_generate_v4(), 'ORDERED'),
(uuid_generate_v4(), 'OPEN'),
(uuid_generate_v4(), 'ORDERED'),
(uuid_generate_v4(), 'OPEN');

INSERT INTO cart_items (cart_id, product_id, count) VALUES
((SELECT id FROM carts ORDER BY created_at LIMIT 1), uuid_generate_v4(), 2),
((SELECT id FROM carts ORDER BY created_at LIMIT 1), uuid_generate_v4(), 1),
((SELECT id FROM carts ORDER BY created_at OFFSET 1 LIMIT 1), uuid_generate_v4(), 3),
((SELECT id FROM carts ORDER BY created_at OFFSET 2 LIMIT 1), uuid_generate_v4(), 1),
((SELECT id FROM carts ORDER BY created_at OFFSET 2 LIMIT 1), uuid_generate_v4(), 2),
((SELECT id FROM carts ORDER BY created_at OFFSET 3 LIMIT 1), uuid_generate_v4(), 4),
((SELECT id FROM carts ORDER BY created_at OFFSET 4 LIMIT 1), uuid_generate_v4(), 1),
((SELECT id FROM carts ORDER BY created_at OFFSET 4 LIMIT 1), uuid_generate_v4(), 3);
