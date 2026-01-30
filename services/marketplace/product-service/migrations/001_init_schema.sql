-- AgroDeep Product Service Database Schema
-- PostgreSQL 15+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories table (hierarchical)
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  icon VARCHAR(255),
  display_order INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(500) NOT NULL,
  slug VARCHAR(500) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  short_description TEXT,
  category_id UUID NOT NULL REFERENCES categories(id),
  sub_category_id UUID REFERENCES categories(id),
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  original_price DECIMAL(10, 2) CHECK (original_price >= 0),
  unit VARCHAR(50) NOT NULL DEFAULT 'kg',
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  low_stock_threshold INTEGER DEFAULT 10,
  sku VARCHAR(100) UNIQUE NOT NULL,
  images TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  specifications JSONB DEFAULT '{}',
  seller_id UUID NOT NULL,
  seller_name VARCHAR(255) NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0 CHECK (review_count >= 0),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'out_of_stock', 'discontinued')),
  featured BOOLEAN DEFAULT FALSE,
  organic BOOLEAN DEFAULT FALSE,
  certifications TEXT[] DEFAULT '{}',
  origin VARCHAR(255),
  harvest_date DATE,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP,
  
  CONSTRAINT check_harvest_before_expiry CHECK (harvest_date IS NULL OR expiry_date IS NULL OR harvest_date <= expiry_date)
);

-- Product variants table (for size, color, package variations)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inventory transactions table (stock history)
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('purchase', 'sale', 'return', 'adjustment', 'damaged')),
  quantity INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reference_id UUID,
  reference_type VARCHAR(50),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product reviews table
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_display_order ON categories(display_order);

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sub_category_id ON products(sub_category_id);
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_products_organic ON products(organic);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_deleted_at ON products(deleted_at);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_certifications ON products USING GIN(certifications);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);

CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_variant_id ON inventory_transactions(variant_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_created_at ON inventory_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_status ON product_reviews(status);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_products_fulltext ON products USING GIN(to_tsvector('french', name || ' ' || COALESCE(description, '')));

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for auto-update updated_at
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at BEFORE UPDATE ON product_variants
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_reviews_updated_at BEFORE UPDATE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET rating = (
        SELECT COALESCE(AVG(rating), 0)
        FROM product_reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    ),
    review_count = (
        SELECT COUNT(*)
        FROM product_reviews
        WHERE product_id = NEW.product_id AND status = 'approved'
    )
    WHERE id = NEW.product_id;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to update product rating
CREATE TRIGGER update_product_rating_trigger
AFTER INSERT OR UPDATE ON product_reviews
FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- Function to update category product count
CREATE OR REPLACE FUNCTION update_category_product_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.category_id <> NEW.category_id THEN
        UPDATE categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
        UPDATE categories SET product_count = product_count + 1 WHERE id = NEW.category_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE categories SET product_count = product_count - 1 WHERE id = OLD.category_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger to update category product count
CREATE TRIGGER update_category_product_count_trigger
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION update_category_product_count();

-- Insert default categories (Agricultural products)
INSERT INTO categories (name, slug, description, icon, display_order) VALUES
('Céréales', 'cereales', 'Blé, maïs, orge, avoine et autres céréales', 'wheat', 1),
('Fruits', 'fruits', 'Fruits frais et séchés', 'apple', 2),
('Légumes', 'legumes', 'Légumes frais de saison', 'carrot', 3),
('Produits laitiers', 'produits-laitiers', 'Lait, fromage, yaourt et produits laitiers', 'milk', 4),
('Viande', 'viande', 'Viande bovine, porcine, volaille', 'beef', 5),
('Œufs', 'oeufs', 'Œufs frais de ferme', 'egg', 6),
('Produits transformés', 'produits-transformes', 'Conserves, confitures, huiles', 'package', 7),
('Semences', 'semences', 'Graines et semences agricoles', 'sprout', 8),
('Fourrage', 'fourrage', 'Aliments pour animaux', 'hay', 9),
('Équipements', 'equipements', 'Matériel et équipements agricoles', 'tractor', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, slug, description, short_description, category_id, price, original_price, unit, stock, sku, seller_id, seller_name, tags, organic, featured) VALUES
(
  'Blé biologique',
  'ble-biologique',
  'Blé biologique de haute qualité, cultivé sans pesticides ni engrais chimiques. Idéal pour la boulangerie artisanale.',
  'Blé bio sans pesticides',
  (SELECT id FROM categories WHERE slug = 'cereales'),
  45.00,
  50.00,
  'quintal',
  500,
  'BLE-BIO-001',
  uuid_generate_v4(),
  'Ferme Martin',
  ARRAY['bio', 'blé', 'céréale', 'boulangerie'],
  TRUE,
  TRUE
),
(
  'Tomates cerises',
  'tomates-cerises',
  'Tomates cerises fraîches, sucrées et juteuses. Cultivées en plein air sous le soleil.',
  'Tomates cerises fraîches',
  (SELECT id FROM categories WHERE slug = 'legumes'),
  8.50,
  NULL,
  'kg',
  200,
  'TOM-CER-001',
  uuid_generate_v4(),
  'Maraîchers du Sud',
  ARRAY['tomate', 'légume', 'frais'],
  FALSE,
  TRUE
)
ON CONFLICT (sku) DO NOTHING;
