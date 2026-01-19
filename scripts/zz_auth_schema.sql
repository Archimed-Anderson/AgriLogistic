-- Auth Service schema bootstrap for Docker (PostgreSQL)
-- This file runs in the postgres container init phase (docker-entrypoint-initdb.d)
-- It must be executed AFTER databases are created (hence the "zz_" prefix).

\connect agrodeep_auth

-- =================================================================================
-- BEGIN: services/auth-service/migrations/001_init_schema.sql
-- =================================================================================

-- AgroDeep Authentication Service Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  email_verified BOOLEAN DEFAULT FALSE,
  phone VARCHAR(20),
  phone_verified BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT role_check CHECK (role IN ('admin', 'user', 'carrier', 'owner', 'renter'))
);

-- OAuth accounts table
CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(provider, provider_account_id),
  CONSTRAINT provider_check CHECK (provider IN ('google', 'facebook'))
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  refresh_token_hash VARCHAR(255),
  ip_address INET,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Password reset tokens table
CREATE TABLE IF NOT EXISTS password_resets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Email verification tokens table
CREATE TABLE IF NOT EXISTS email_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login attempts tracking (for rate limiting and security)
CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  ip_address INET NOT NULL,
  success BOOLEAN NOT NULL,
  attempted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_deleted_at ON users(deleted_at);

CREATE INDEX IF NOT EXISTS idx_oauth_provider ON oauth_accounts(provider, provider_account_id);
CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_accounts(user_id);

CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token_hash ON sessions(token_hash);
CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions(expires_at);

CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token_hash);
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);

CREATE INDEX IF NOT EXISTS idx_email_verifications_token ON email_verifications(token_hash);
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

CREATE INDEX IF NOT EXISTS idx_login_attempts_email ON login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_login_attempts_ip ON login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_login_attempts_attempted_at ON login_attempts(attempted_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
    DELETE FROM sessions WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE 'plpgsql';

-- Function to clean up expired password reset tokens
CREATE OR REPLACE FUNCTION cleanup_expired_password_resets()
RETURNS void AS $$
BEGIN
    DELETE FROM password_resets WHERE expires_at < CURRENT_TIMESTAMP;
END;
$$ LANGUAGE 'plpgsql';

-- Function to clean up old login attempts (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_login_attempts()
RETURNS void AS $$
BEGIN
    DELETE FROM login_attempts WHERE attempted_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
END;
$$ LANGUAGE 'plpgsql';

-- Insert default admin user (password: Admin123!)
-- Password hash generated with bcrypt, rounds=12
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES (
  'admin@agrodeep.com',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OfmVKujVPeem',
  'Admin',
  'AgroDeep',
  'admin',
  TRUE
) ON CONFLICT (email) DO NOTHING;

-- Insert test users for development
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES 
  ('farmer@agrodeep.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OfmVKujVPeem', 'Jean', 'Dupont', 'user', TRUE),
  ('carrier@agrodeep.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OfmVKujVPeem', 'Marie', 'Martin', 'carrier', TRUE),
  ('owner@agrodeep.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5OfmVKujVPeem', 'Pierre', 'Bernard', 'owner', TRUE)
ON CONFLICT (email) DO NOTHING;

-- =================================================================================
-- END: services/auth-service/migrations/001_init_schema.sql
-- =================================================================================

-- =================================================================================
-- BEGIN: services/auth-service/migrations/002_multi_role_migration.sql
-- =================================================================================

-- AgroDeep Multi-Role Authentication Migration
-- Migration script to add permissions system and update roles
-- Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role VARCHAR(20) NOT NULL,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (role, permission_id)
);
-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_permissions_category ON permissions(category);
CREATE INDEX IF NOT EXISTS idx_permissions_name ON permissions(name);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON role_permissions(role);
-- Insert permission categories and permissions
INSERT INTO permissions (name, description, category) VALUES
  -- User Management (Admin only)
  ('user:create', 'Créer de nouveaux utilisateurs', 'user_management'),
  ('user:read', 'Lire les informations utilisateurs', 'user_management'),
  ('user:update', 'Modifier les utilisateurs', 'user_management'),
  ('user:delete', 'Supprimer des utilisateurs', 'user_management'),
  ('user:assign_roles', 'Assigner des rôles aux utilisateurs', 'user_management'),
  
  -- Product Management
  ('product:browse', 'Parcourir les produits', 'product_management'),
  ('product:search', 'Rechercher des produits', 'product_management'),
  ('product:create', 'Créer des produits', 'product_management'),
  ('product:update', 'Modifier des produits', 'product_management'),
  ('product:delete', 'Supprimer des produits', 'product_management'),
  ('product:approve', 'Approuver des produits', 'product_management'),
  
  -- Order Management
  ('order:create', 'Créer des commandes', 'order_management'),
  ('order:view_own', 'Voir ses propres commandes', 'order_management'),
  ('order:view_all', 'Voir toutes les commandes', 'order_management'),
  ('order:cancel_own', 'Annuler ses propres commandes', 'order_management'),
  ('order:cancel_any', 'Annuler toute commande', 'order_management'),
  ('order:process', 'Traiter les commandes', 'order_management'),
  ('order:refund', 'Rembourser des commandes', 'order_management'),
  
  -- Delivery Management
  ('delivery:view_assigned', 'Voir ses livraisons assignées', 'delivery_management'),
  ('delivery:view_all', 'Voir toutes les livraisons', 'delivery_management'),
  ('delivery:update_status', 'Mettre à jour le statut de livraison', 'delivery_management'),
  ('delivery:track', 'Suivre les livraisons', 'delivery_management'),
  ('delivery:confirm', 'Confirmer les livraisons', 'delivery_management'),
  ('delivery:assign', 'Assigner des livraisons', 'delivery_management'),
  
  -- Cart & Wishlist
  ('cart:manage', 'Gérer son panier', 'cart_management'),
  ('wishlist:manage', 'Gérer sa liste de souhaits', 'cart_management'),
  
  -- Profile Management
  ('profile:view_own', 'Voir son propre profil', 'profile_management'),
  ('profile:update_own', 'Modifier son propre profil', 'profile_management'),
  ('profile:view_others', 'Voir les profils des autres', 'profile_management'),
  
  -- Reviews & Ratings
  ('review:create', 'Créer des avis', 'review_management'),
  ('review:update_own', 'Modifier ses propres avis', 'review_management'),
  ('review:delete_any', 'Supprimer tout avis', 'review_management'),
  
  -- Analytics & Reports
  ('analytics:view', 'Voir les analytics', 'analytics'),
  ('analytics:export', 'Exporter les données analytics', 'analytics'),
  
  -- System Management
  ('system:config', 'Configurer le système', 'system_management'),
  ('system:logs', 'Voir les logs système', 'system_management'),
  ('system:settings', 'Modifier les paramètres système', 'system_management')
ON CONFLICT (name) DO NOTHING;
-- Assign permissions to ADMIN role (all permissions)
INSERT INTO role_permissions (role, permission_id)
SELECT 'admin', id FROM permissions
ON CONFLICT DO NOTHING;
-- Assign permissions to BUYER role
INSERT INTO role_permissions (role, permission_id)
SELECT 'buyer', id FROM permissions WHERE name IN (
  'product:browse',
  'product:search',
  'order:create',
  'order:view_own',
  'order:cancel_own',
  'delivery:track',
  'cart:manage',
  'wishlist:manage',
  'profile:view_own',
  'profile:update_own',
  'review:create',
  'review:update_own'
)
ON CONFLICT DO NOTHING;
-- Assign permissions to TRANSPORTER role
INSERT INTO role_permissions (role, permission_id)
SELECT 'transporter', id FROM permissions WHERE name IN (
  'delivery:view_assigned',
  'delivery:update_status',
  'delivery:track',
  'delivery:confirm',
  'profile:view_own',
  'profile:update_own'
)
ON CONFLICT DO NOTHING;
-- Migration strategy for existing users
-- Update old roles to new roles
UPDATE users SET role = 'buyer' WHERE role IN ('user', 'owner', 'renter');
UPDATE users SET role = 'transporter' WHERE role = 'carrier';

-- Update the users table role constraint (after data migration)
ALTER TABLE users DROP CONSTRAINT IF EXISTS role_check;
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'buyer';
ALTER TABLE users ADD CONSTRAINT role_check CHECK (role IN ('admin', 'buyer', 'transporter'));
-- Insert default admin user with new credentials
-- Password: Admin123 (hashed with bcrypt rounds=12)
INSERT INTO users (email, password_hash, first_name, last_name, role, email_verified)
VALUES (
  'admintest@gmail.com',
  '$2b$12$nn6AxCh2J8YGSHpuNOW26etlhZE12JrXOxDG3kYdxLZe2kFjKwBIe',
  'Admin',
  'Test',
  'admin',
  TRUE
) ON CONFLICT (email) DO UPDATE 
  SET password_hash = EXCLUDED.password_hash,
      role = EXCLUDED.role;
-- Create a function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_role VARCHAR)
RETURNS TABLE(permission_name VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT p.name::VARCHAR
  FROM permissions p
  JOIN role_permissions rp ON p.id = rp.permission_id
  WHERE rp.role = user_role;
END;
$$ LANGUAGE plpgsql;
-- Create a function to check if user has permission
CREATE OR REPLACE FUNCTION user_has_permission(user_role VARCHAR, required_permission VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
  has_perm BOOLEAN;
BEGIN
  -- Admin has all permissions
  IF user_role = 'admin' THEN
    RETURN TRUE;
  END IF;
  
  -- Check if user has the specific permission
  SELECT EXISTS(
    SELECT 1
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role = user_role AND p.name = required_permission
  ) INTO has_perm;
  
  RETURN has_perm;
END;
$$ LANGUAGE plpgsql;
-- Create view for user permissions (for easy querying)
CREATE OR REPLACE VIEW user_role_permissions AS
SELECT 
  rp.role,
  p.name as permission_name,
  p.description as permission_description,
  p.category as permission_category
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
ORDER BY rp.role, p.category, p.name;
-- Add comments for documentation
COMMENT ON TABLE permissions IS 'System-wide permissions that can be assigned to roles';
COMMENT ON TABLE role_permissions IS 'Junction table mapping roles to their permissions';
COMMENT ON FUNCTION get_user_permissions IS 'Returns all permission names for a given role';
COMMENT ON FUNCTION user_has_permission IS 'Checks if a role has a specific permission';

-- =================================================================================
-- END: services/auth-service/migrations/002_multi_role_migration.sql
-- =================================================================================

