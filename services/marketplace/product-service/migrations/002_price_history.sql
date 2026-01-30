-- Add price history tracking
CREATE TABLE IF NOT EXISTS product_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    product_id UUID NOT NULL REFERENCES products (id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_product_price_history_product_id ON product_price_history (product_id);

CREATE INDEX IF NOT EXISTS idx_product_price_history_created_at ON product_price_history (created_at);

-- Trigger to automatically record price changes
CREATE OR REPLACE FUNCTION record_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF (OLD.price IS NULL OR NEW.price <> OLD.price) THEN
        INSERT INTO product_price_history (product_id, price)
        VALUES (NEW.id, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER record_price_change_trigger
AFTER INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION record_price_change();