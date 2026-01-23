"""
Database Models for Payment Service
"""
from sqlalchemy import (
    Column, String, Integer, Numeric, Boolean, DateTime, 
    ForeignKey, Text, CheckConstraint, Index, Enum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import uuid
import enum

Base = declarative_base()


class TransactionType(enum.Enum):
    PAYMENT = "payment"
    REFUND = "refund"
    PAYOUT = "payout"
    TOP_UP = "top_up"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"


class TransactionStatus(enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELED = "canceled"
    REFUNDED = "refunded"


class EscrowStatus(enum.Enum):
    HELD = "held"
    RELEASED = "released"
    REFUNDED = "refunded"


class PayoutStatus(enum.Enum):
    PENDING = "pending"
    IN_TRANSIT = "in_transit"
    PAID = "paid"
    FAILED = "failed"
    CANCELED = "canceled"


class SubscriptionStatus(enum.Enum):
    ACTIVE = "active"
    CANCELED = "canceled"
    PAST_DUE = "past_due"
    TRIALING = "trialing"
    INCOMPLETE = "incomplete"


class PaymentProvider(Base):
    """Payment providers configuration"""
    __tablename__ = "payment_providers"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(50), unique=True, nullable=False)  # stripe, paypal, flutterwave
    is_active = Column(Boolean, default=True)
    config = Column(JSONB)  # API keys, secrets (encrypted)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class PaymentMethod(Base):
    """User saved payment methods"""
    __tablename__ = "payment_methods"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    provider = Column(String(50), nullable=False)
    provider_payment_method_id = Column(String(255))  # Stripe pm_xxx
    type = Column(String(50))  # card, bank_account, mobile_money
    last4 = Column(String(4))
    brand = Column(String(50))  # visa, mastercard
    exp_month = Column(Integer)
    exp_year = Column(Integer)
    is_default = Column(Boolean, default=False)
    extra_data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    transactions = relationship("Transaction", back_populates="payment_method")


class Transaction(Base):
    """All payment transactions"""
    __tablename__ = "transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    idempotency_key = Column(String(255), unique=True)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    order_id = Column(UUID(as_uuid=True), index=True)  # nullable for top-ups
    type = Column(String(50), nullable=False)
    status = Column(String(50), default="pending")
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), default="XOF")
    fee = Column(Numeric(15, 2), default=0)
    net_amount = Column(Numeric(15, 2))
    provider = Column(String(50), nullable=False)
    provider_transaction_id = Column(String(255))
    payment_method_id = Column(UUID(as_uuid=True), ForeignKey("payment_methods.id"))
    extra_data = Column(JSONB)
    error_code = Column(String(100))
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    # Relationships
    payment_method = relationship("PaymentMethod", back_populates="transactions")
    escrow_hold = relationship("EscrowHold", back_populates="transaction", uselist=False)
    wallet_transactions = relationship("WalletTransaction", back_populates="transaction")
    
    # Indexes
    __table_args__ = (
        Index("idx_transactions_user_status", "user_id", "status"),
        Index("idx_transactions_provider_id", "provider_transaction_id"),
    )


class EscrowHold(Base):
    """Marketplace escrow for safe transactions"""
    __tablename__ = "escrow_holds"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"))
    order_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    seller_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    status = Column(String(50), default="held")
    release_date = Column(DateTime(timezone=True))  # Auto-release after N days
    released_at = Column(DateTime(timezone=True))
    released_to_transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    transaction = relationship("Transaction", back_populates="escrow_hold", foreign_keys=[transaction_id])
    
    __table_args__ = (
        Index("idx_escrow_status_release", "status", "release_date"),
    )


class SplitPaymentRule(Base):
    """Marketplace commission rules"""
    __tablename__ = "split_payment_rules"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    platform_fee_percent = Column(Numeric(5, 2), default=10.00)
    platform_fee_fixed = Column(Numeric(15, 2), default=0)
    payment_provider_fee_percent = Column(Numeric(5, 2), default=2.90)
    payment_provider_fee_fixed = Column(Numeric(15, 2), default=30)  # 30 XOF
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Payout(Base):
    """Payouts to sellers"""
    __tablename__ = "payouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    seller_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), default="XOF")
    status = Column(String(50), default="pending")
    provider = Column(String(50))
    provider_payout_id = Column(String(255))
    bank_account_id = Column(UUID(as_uuid=True))
    arrival_date = Column(DateTime(timezone=True))
    failure_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    
    __table_args__ = (
        Index("idx_payouts_seller_status", "seller_id", "status"),
    )


class Wallet(Base):
    """User virtual wallets"""
    __tablename__ = "wallets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    balance = Column(Numeric(15, 2), default=0)
    currency = Column(String(3), default="XOF")
    reserved_balance = Column(Numeric(15, 2), default=0)
    total_deposited = Column(Numeric(15, 2), default=0)
    total_withdrawn = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    # Relationships
    wallet_transactions = relationship("WalletTransaction", back_populates="wallet")
    
    __table_args__ = (
        CheckConstraint("balance >= 0", name="wallet_balance_positive"),
        CheckConstraint("reserved_balance >= 0", name="wallet_reserved_positive"),
    )


class WalletTransaction(Base):
    """Wallet transaction history"""
    __tablename__ = "wallet_transactions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    wallet_id = Column(UUID(as_uuid=True), ForeignKey("wallets.id"), nullable=False)
    transaction_id = Column(UUID(as_uuid=True), ForeignKey("transactions.id"))
    type = Column(String(50), nullable=False)  # deposit, withdrawal, payment, refund, transfer
    amount = Column(Numeric(15, 2), nullable=False)
    balance_after = Column(Numeric(15, 2), nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    wallet = relationship("Wallet", back_populates="wallet_transactions")
    transaction = relationship("Transaction", back_populates="wallet_transactions")
    
    __table_args__ = (
        Index("idx_wallet_tx_wallet_created", "wallet_id", "created_at"),
    )


class Subscription(Base):
    """User subscriptions"""
    __tablename__ = "subscriptions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    plan = Column(String(50), nullable=False)  # free, pro, enterprise
    status = Column(String(50), default="active")
    provider = Column(String(50))  # stripe, paypal
    provider_subscription_id = Column(String(255))
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    cancel_at = Column(DateTime(timezone=True))
    canceled_at = Column(DateTime(timezone=True))
    trial_end = Column(DateTime(timezone=True))
    extra_data = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    
    __table_args__ = (
        Index("idx_subscriptions_user_status", "user_id", "status"),
    )


class WebhookEvent(Base):
    """Audit log for webhook events"""
    __tablename__ = "webhook_events"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    provider = Column(String(50), nullable=False)
    event_id = Column(String(255), unique=True)  # Stripe evt_xxx
    event_type = Column(String(100), nullable=False)
    payload = Column(JSONB, nullable=False)
    processed = Column(Boolean, default=False)
    processed_at = Column(DateTime(timezone=True))
    retry_count = Column(Integer, default=0)
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    __table_args__ = (
        Index("idx_webhook_processed_created", "processed", "created_at"),
    )
