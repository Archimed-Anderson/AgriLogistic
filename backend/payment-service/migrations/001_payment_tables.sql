-- Payment Service Database Migration
-- Version: 001
-- Date: 2026-01-22

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Payment Providers
CREATE TABLE payment_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(50) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    config JSONB,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Payment Methods (user saved cards/accounts)
CREATE TABLE payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL,
    provider VARCHAR(50) NOT NULL,
    provider_payment_method_id VARCHAR(255),
    type VARCHAR(50),
    last4 VARCHAR(4),
    brand VARCHAR(50),
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    idempotency_key VARCHAR(255) UNIQUE,
    user_id UUID NOT NULL,
    order_id UUID,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    fee DECIMAL(15, 2) DEFAULT 0,
    net_amount DECIMAL(15, 2),
    provider VARCHAR(50) NOT NULL,
    provider_transaction_id VARCHAR(255),
    payment_method_id UUID REFERENCES payment_methods (id),
    metadata JSONB,
    error_code VARCHAR(100),
    error_message TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP
    WITH
        TIME ZONE
);

-- Escrow Holds
CREATE TABLE escrow_holds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    transaction_id UUID REFERENCES transactions (id),
    order_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'held',
    release_date TIMESTAMP
    WITH
        TIME ZONE,
        released_at TIMESTAMP
    WITH
        TIME ZONE,
        released_to_transaction_id UUID REFERENCES transactions (id),
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Split Payment Rules
CREATE TABLE split_payment_rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name VARCHAR(100) NOT NULL,
    platform_fee_percent DECIMAL(5, 2) DEFAULT 10.00,
    platform_fee_fixed DECIMAL(15, 2) DEFAULT 0,
    payment_provider_fee_percent DECIMAL(5, 2) DEFAULT 2.90,
    payment_provider_fee_fixed DECIMAL(15, 2) DEFAULT 30,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Payouts
CREATE TABLE payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    seller_id UUID NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'XOF',
    status VARCHAR(50) DEFAULT 'pending',
    provider VARCHAR(50),
    provider_payout_id VARCHAR(255),
    bank_account_id UUID,
    arrival_date TIMESTAMP
    WITH
        TIME ZONE,
        failure_reason TEXT,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        completed_at TIMESTAMP
    WITH
        TIME ZONE
);

-- Wallets
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID UNIQUE NOT NULL,
    balance DECIMAL(15, 2) DEFAULT 0 CHECK (balance >= 0),
    currency VARCHAR(3) DEFAULT 'XOF',
    reserved_balance DECIMAL(15, 2) DEFAULT 0 CHECK (reserved_balance >= 0),
    total_deposited DECIMAL(15, 2) DEFAULT 0,
    total_withdrawn DECIMAL(15, 2) DEFAULT 0,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    wallet_id UUID REFERENCES wallets (id) NOT NULL,
    transaction_id UUID REFERENCES transactions (id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_after DECIMAL(15, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL,
    plan VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    provider VARCHAR(50),
    provider_subscription_id VARCHAR(255),
    current_period_start TIMESTAMP
    WITH
        TIME ZONE,
        current_period_end TIMESTAMP
    WITH
        TIME ZONE,
        cancel_at TIMESTAMP
    WITH
        TIME ZONE,
        canceled_at TIMESTAMP
    WITH
        TIME ZONE,
        trial_end TIMESTAMP
    WITH
        TIME ZONE,
        metadata JSONB,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Webhook Events (audit log)
CREATE TABLE webhook_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    provider VARCHAR(50) NOT NULL,
    event_id VARCHAR(255) UNIQUE,
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    processed BOOLEAN DEFAULT FALSE,
    processed_at TIMESTAMP
    WITH
        TIME ZONE,
        retry_count INTEGER DEFAULT 0,
        error_message TEXT,
        created_at TIMESTAMP
    WITH
        TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_transactions_user ON transactions (user_id);

CREATE INDEX idx_transactions_order ON transactions (order_id);

CREATE INDEX idx_transactions_status ON transactions (status);

CREATE INDEX idx_transactions_provider_id ON transactions (provider_transaction_id);

CREATE INDEX idx_escrow_status ON escrow_holds (status);

CREATE INDEX idx_escrow_release ON escrow_holds (status, release_date);

CREATE INDEX idx_payouts_seller ON payouts (seller_id);

CREATE INDEX idx_payouts_status ON payouts (seller_id, status);

CREATE INDEX idx_wallet_tx ON wallet_transactions (wallet_id, created_at);

CREATE INDEX idx_subscriptions_user ON subscriptions (user_id, status);

CREATE INDEX idx_webhook_processed ON webhook_events (processed, created_at);

-- Insert default payment providers
INSERT INTO
    payment_providers (name, is_active)
VALUES ('stripe', TRUE),
    ('paypal', TRUE),
    ('flutterwave', TRUE),
    ('wallet', TRUE);

-- Insert default split payment rule
INSERT INTO
    split_payment_rules (name, platform_fee_percent)
VALUES ('default', 10.00);