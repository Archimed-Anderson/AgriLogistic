-- Affiliation Service Database Migration
-- Version: 001

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID UNIQUE NOT NULL,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    tier VARCHAR(20) DEFAULT 'bronze',
    commission_rate DECIMAL(5, 2) DEFAULT 8.00,
    total_earnings DECIMAL(15, 2) DEFAULT 0,
    pending_earnings DECIMAL(15, 2) DEFAULT 0,
    paid_earnings DECIMAL(15, 2) DEFAULT 0,
    total_referrals INTEGER DEFAULT 0,
    total_conversions INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE affiliate_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    affiliate_id UUID REFERENCES affiliates (id) NOT NULL,
    short_code VARCHAR(20) UNIQUE NOT NULL,
    target_url TEXT NOT NULL,
    campaign VARCHAR(100),
    product_id UUID,
    category VARCHAR(50),
    total_clicks INTEGER DEFAULT 0,
    unique_clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    revenue DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE clicks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    link_id UUID REFERENCES affiliate_links (id) NOT NULL,
    visitor_id VARCHAR(64),
    ip_hash VARCHAR(64),
    user_agent TEXT,
    referer TEXT,
    country VARCHAR(2),
    device_type VARCHAR(20),
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    affiliate_id UUID REFERENCES affiliates (id) NOT NULL,
    referred_user_id UUID UNIQUE NOT NULL,
    link_id UUID REFERENCES affiliate_links (id),
    status VARCHAR(20) DEFAULT 'pending',
    first_purchase_at TIMESTAMP
    WITH
        TIME ZONE,
        total_purchases DECIMAL(15, 2) DEFAULT 0,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    affiliate_id UUID REFERENCES affiliates (id) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    status VARCHAR(20) DEFAULT 'pending',
    payment_method VARCHAR(50),
    payment_details JSONB,
    transaction_id VARCHAR(255),
    processed_at TIMESTAMP
    WITH
        TIME ZONE,
        failure_reason TEXT,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

CREATE TABLE commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    affiliate_id UUID REFERENCES affiliates (id) NOT NULL,
    referral_id UUID REFERENCES referrals (id),
    order_id UUID NOT NULL,
    order_amount DECIMAL(15, 2) NOT NULL,
    commission_rate DECIMAL(5, 2) NOT NULL,
    commission_amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    approved_at TIMESTAMP
    WITH
        TIME ZONE,
        paid_at TIMESTAMP
    WITH
        TIME ZONE,
        payout_id UUID REFERENCES payouts (id),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_affiliates_user ON affiliates (user_id);

CREATE INDEX idx_affiliates_code ON affiliates (referral_code);

CREATE INDEX idx_links_affiliate ON affiliate_links (affiliate_id);

CREATE INDEX idx_links_code ON affiliate_links (short_code);

CREATE INDEX idx_clicks_link ON clicks (link_id, created_at);

CREATE INDEX idx_referrals_affiliate ON referrals (affiliate_id);

CREATE INDEX idx_commissions_affiliate ON commissions (affiliate_id, status);

CREATE INDEX idx_payouts_affiliate ON payouts (affiliate_id, status);