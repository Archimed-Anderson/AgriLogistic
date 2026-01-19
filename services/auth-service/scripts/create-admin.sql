-- Script pour créer un compte administrateur de test
-- Mot de passe: Admin@123
-- Hash bcrypt pour "Admin@123": $2b$10$5ux3lYUX9FyU0Z5Zs.wdRumGqwg4vE9jWjM6tL3VL0WE0aZ3YcR1W

INSERT INTO users (
  id, 
  email, 
  password_hash, 
  first_name, 
  last_name, 
  role, 
  email_verified,
  is_active,
  created_at, 
  updated_at
) VALUES (
  gen_random_uuid(),
  'admintest@gmail.com',
  '$2b$10$5ux3lYUX9FyU0Z5Zs.wdRumGqwg4vE9jWjM6tL3VL0WE0aZ3YcR1W',
  'Admin',
  'Test',
  'admin',
  true,
  true,
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Vérification
SELECT id, email, first_name, last_name, role, email_verified, is_active, created_at 
FROM users 
WHERE email = 'admintest@gmail.com';
