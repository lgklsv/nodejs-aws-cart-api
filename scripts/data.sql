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

INSERT INTO users (name, email, password) VALUES
('John Doe', 'john.doe@example.com', 'password123'),
('Jane Smith', 'jane.smith@example.com', 'securepass'),
('Alice Johnson', 'alice.johnson@example.com', 'mysecret');

INSERT INTO orders (user_id, cart_id, items, payment, delivery, comments, status, total) VALUES
(
    (SELECT id FROM users WHERE name = 'John Doe'),
    (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE name = 'John Doe')),
    '[{"product_id": "' || uuid_generate_v4() || '", "count": 2}, {"product_id": "' || uuid_generate_v4() || '", "count": 1}]'::jsonb,
    '{"type": "credit card", "amount": 100, "currency": "USD", "details": {"card_number": "xxxx-xxxx-xxxx-1234"}}'::jsonb,
    '{"address": "123 Main St", "firstName": "John", "lastName": "Doe", "comment": "Leave at front door."}'::jsonb,
    'Leave at front door.',
    'APPROVED',
    100
),
(
    (SELECT id FROM users WHERE name = 'Jane Smith'),
    (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE name = 'Jane Smith')),
    '[{"product_id": "' || uuid_generate_v4() || '", "count": 3}]'::jsonb,
    '{"type": "paypal", "amount": 150, "currency": "USD", "details": {"paypal_email": "jane@paypal.com"}}'::jsonb,
    '{"address": "456 Oak Ave", "firstName": "Jane", "lastName": "Smith", "comment": "Call before delivery."}'::jsonb,
    'Call before delivery.',
    'SENT',
    150
),
(
    (SELECT id FROM users WHERE name = 'Alice Johnson'),
    (SELECT id FROM carts WHERE user_id = (SELECT id FROM users WHERE name = 'Alice Johnson')),
    '[{"product_id": "' || uuid_generate_v4() || '", "count": 1}]'::jsonb,
    '{"type": "debit", "amount": 50, "currency": "USD", "details": {"debit_number": "xxxx-xxxx-xxxx-5678"}}'::jsonb,
    '{"address": "789 Pine Ln", "firstName": "Alice", "lastName": "Johnson", "comment": "Handle with care."}'::jsonb,
    'Handle with care.',
    'OPEN',
    50
);
