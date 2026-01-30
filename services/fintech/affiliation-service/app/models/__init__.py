"""SQLAlchemy Models for Affiliation Service"""
from sqlalchemy import Column, String, Integer, Numeric, Boolean, DateTime, ForeignKey, Text, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
import uuid

Base = declarative_base()


class Affiliate(Base):
    """Affiliate user profile"""
    __tablename__ = "affiliates"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    referral_code = Column(String(20), unique=True, nullable=False)
    tier = Column(String(20), default="bronze")  # bronze, silver, gold, platinum
    commission_rate = Column(Numeric(5, 2), default=8.00)
    total_earnings = Column(Numeric(15, 2), default=0)
    pending_earnings = Column(Numeric(15, 2), default=0)
    paid_earnings = Column(Numeric(15, 2), default=0)
    total_referrals = Column(Integer, default=0)
    total_conversions = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    metadata = Column(JSONB)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    links = relationship("AffiliateLink", back_populates="affiliate")
    referrals = relationship("Referral", back_populates="affiliate")
    commissions = relationship("Commission", back_populates="affiliate")


class AffiliateLink(Base):
    """Trackable affiliate links"""
    __tablename__ = "affiliate_links"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("affiliates.id"), nullable=False)
    short_code = Column(String(20), unique=True, nullable=False)
    target_url = Column(Text, nullable=False)
    campaign = Column(String(100))
    product_id = Column(UUID(as_uuid=True))
    category = Column(String(50))
    total_clicks = Column(Integer, default=0)
    unique_clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    revenue = Column(Numeric(15, 2), default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    affiliate = relationship("Affiliate", back_populates="links")
    clicks = relationship("Click", back_populates="link")


class Click(Base):
    """Click tracking"""
    __tablename__ = "clicks"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    link_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_links.id"), nullable=False)
    visitor_id = Column(String(64))  # Hashed fingerprint
    ip_hash = Column(String(64))
    user_agent = Column(Text)
    referer = Column(Text)
    country = Column(String(2))
    device_type = Column(String(20))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    link = relationship("AffiliateLink", back_populates="clicks")
    
    __table_args__ = (Index("idx_clicks_link_date", "link_id", "created_at"),)


class Referral(Base):
    """Referred users"""
    __tablename__ = "referrals"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("affiliates.id"), nullable=False)
    referred_user_id = Column(UUID(as_uuid=True), unique=True, nullable=False)
    link_id = Column(UUID(as_uuid=True), ForeignKey("affiliate_links.id"))
    status = Column(String(20), default="pending")  # pending, active, converted, churned
    first_purchase_at = Column(DateTime(timezone=True))
    total_purchases = Column(Numeric(15, 2), default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    affiliate = relationship("Affiliate", back_populates="referrals")


class Commission(Base):
    """Commission records"""
    __tablename__ = "commissions"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("affiliates.id"), nullable=False)
    referral_id = Column(UUID(as_uuid=True), ForeignKey("referrals.id"))
    order_id = Column(UUID(as_uuid=True), nullable=False)
    order_amount = Column(Numeric(15, 2), nullable=False)
    commission_rate = Column(Numeric(5, 2), nullable=False)
    commission_amount = Column(Numeric(15, 2), nullable=False)
    status = Column(String(20), default="pending")  # pending, approved, paid, cancelled
    approved_at = Column(DateTime(timezone=True))
    paid_at = Column(DateTime(timezone=True))
    payout_id = Column(UUID(as_uuid=True), ForeignKey("payouts.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    affiliate = relationship("Affiliate", back_populates="commissions")
    
    __table_args__ = (Index("idx_commissions_affiliate_status", "affiliate_id", "status"),)


class Payout(Base):
    """Affiliate payouts"""
    __tablename__ = "payouts"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    affiliate_id = Column(UUID(as_uuid=True), ForeignKey("affiliates.id"), nullable=False)
    amount = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(3), default="XOF")
    status = Column(String(20), default="pending")  # pending, processing, paid, failed
    payment_method = Column(String(50))
    payment_details = Column(JSONB)
    transaction_id = Column(String(255))
    processed_at = Column(DateTime(timezone=True))
    failure_reason = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
