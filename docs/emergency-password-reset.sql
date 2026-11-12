# Quick password reset for admin (emergency use only)
# Run this in Supabase SQL Editor when locked out

# 1. Set new password directly:
UPDATE auth.users
SET encrypted_password = crypt('YOUR_NEW_PASSWORD_HERE', gen_salt('bf'))
WHERE email = 'hauntedboydip@gmail.com';

# 2. Or create a new admin user:
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'hauntedboydip@gmail.com',
  crypt('YOUR_NEW_PASSWORD_HERE', gen_salt('bf')),
  now(),
  now(),
  now()
);
