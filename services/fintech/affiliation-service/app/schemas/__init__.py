"""Pydantic Schemas for Affiliation API"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
import uuid


class AffiliateCreate(BaseModel):
    user_id: uuid.UUID
    referral_code: Optional[str] = None


class AffiliateResponse(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    referral_code: str
    tier: str
    commission_rate: Decimal
    total_earnings: Decimal
    pending_earnings: Decimal
    paid_earnings: Decimal
    total_referrals: int
    total_conversions: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class LinkCreate(BaseModel):
    target_url: str
    campaign: Optional[str] = None
    product_id: Optional[uuid.UUID] = None
    category: Optional[str] = None


class LinkResponse(BaseModel):
    id: uuid.UUID
    short_code: str
    target_url: str
    campaign: Optional[str]
    total_clicks: int
    unique_clicks: int
    conversions: int
    revenue: Decimal
    affiliate_url: str
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class TrackClickRequest(BaseModel):
    short_code: str
    visitor_id: Optional[str] = None
    user_agent: Optional[str] = None
    referer: Optional[str] = None
    ip_address: Optional[str] = None


class TrackConversionRequest(BaseModel):
    order_id: uuid.UUID
    order_amount: Decimal
    referred_user_id: uuid.UUID


class CommissionResponse(BaseModel):
    id: uuid.UUID
    order_id: uuid.UUID
    order_amount: Decimal
    commission_rate: Decimal
    commission_amount: Decimal
    status: str
    created_at: datetime
    paid_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class PayoutRequest(BaseModel):
    amount: Decimal = Field(..., gt=0)
    payment_method: str
    payment_details: dict


class PayoutResponse(BaseModel):
    id: uuid.UUID
    amount: Decimal
    currency: str
    status: str
    payment_method: str
    created_at: datetime
    processed_at: Optional[datetime]
    
    class Config:
        from_attributes = True


class StatsResponse(BaseModel):
    total_clicks: int
    unique_clicks: int
    conversions: int
    conversion_rate: float
    total_earnings: Decimal
    pending_earnings: Decimal
    paid_earnings: Decimal
    total_referrals: int
    active_links: int
