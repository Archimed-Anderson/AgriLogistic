"""
Pydantic Schemas for Payment API
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from decimal import Decimal
from enum import Enum
import uuid


# Enums
class PaymentProvider(str, Enum):
    STRIPE = "stripe"
    PAYPAL = "paypal"
    FLUTTERWAVE = "flutterwave"
    WALLET = "wallet"


class TransactionType(str, Enum):
    PAYMENT = "payment"
    REFUND = "refund"
    PAYOUT = "payout"
    TOP_UP = "top_up"
    WITHDRAWAL = "withdrawal"
    TRANSFER = "transfer"


class TransactionStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    SUCCEEDED = "succeeded"
    FAILED = "failed"
    CANCELED = "canceled"


class Currency(str, Enum):
    XOF = "XOF"
    EUR = "EUR"
    USD = "USD"


# Request Schemas
class CreatePaymentIntentRequest(BaseModel):
    """Create Stripe Payment Intent"""
    amount: int = Field(..., gt=0, description="Amount in smallest currency unit")
    currency: Currency = Currency.XOF
    order_id: Optional[uuid.UUID] = None
    payment_method_id: Optional[uuid.UUID] = None
    save_payment_method: bool = False
    extra_data: Optional[Dict[str, Any]] = None
    
    class Config:
        json_schema_extra = {
            "example": {
                "amount": 50000,
                "currency": "XOF",
                "order_id": "123e4567-e89b-12d3-a456-426614174000",
                "save_payment_method": True,
                "extra_data": {"order_number": "ORD-2024-001"}
            }
        }


class CreatePayPalOrderRequest(BaseModel):
    """Create PayPal Order"""
    amount: Decimal = Field(..., gt=0)
    currency: Currency = Currency.EUR
    order_id: uuid.UUID
    description: Optional[str] = "AgroLogistic Purchase"
    return_url: Optional[str] = None
    cancel_url: Optional[str] = None


class MarketplacePaymentRequest(BaseModel):
    """Marketplace split payment"""
    order_id: uuid.UUID
    amount: int = Field(..., gt=0)
    seller_id: uuid.UUID
    payment_method_id: uuid.UUID
    split_rule: Optional[Dict[str, Any]] = Field(
        default={
            "platform_fee_percent": 10,
            "hold_in_escrow": True,
            "auto_release_days": 7
        }
    )


class RefundRequest(BaseModel):
    """Create refund request"""
    amount: Optional[int] = Field(None, gt=0, description="Partial refund amount")
    reason: str = "requested_by_customer"
    
    @validator("reason")
    def validate_reason(cls, v):
        valid_reasons = ["duplicate", "fraudulent", "requested_by_customer"]
        if v not in valid_reasons:
            raise ValueError(f"Reason must be one of: {valid_reasons}")
        return v


class WalletTopUpRequest(BaseModel):
    """Top up wallet"""
    amount: int = Field(..., gt=0, le=1000000)  # Max 1M XOF per top-up
    payment_method_id: uuid.UUID


class WalletWithdrawRequest(BaseModel):
    """Withdraw from wallet"""
    amount: int = Field(..., gt=0)
    bank_account_id: uuid.UUID


class WalletTransferRequest(BaseModel):
    """Wallet-to-wallet transfer"""
    recipient_user_id: uuid.UUID
    amount: int = Field(..., gt=0, le=500000)  # Max 500K XOF per transfer
    note: Optional[str] = Field(None, max_length=200)


class CreateSubscriptionRequest(BaseModel):
    """Create subscription"""
    plan: str = Field(..., pattern="^(free|pro|enterprise)$")
    payment_method_id: Optional[uuid.UUID] = None
    trial_days: Optional[int] = Field(None, ge=0, le=30)


class UpdateSubscriptionRequest(BaseModel):
    """Update subscription plan"""
    plan: str = Field(..., pattern="^(free|pro|enterprise)$")


class SavePaymentMethodRequest(BaseModel):
    """Save new payment method"""
    provider: PaymentProvider
    provider_payment_method_id: str
    set_as_default: bool = False


# Response Schemas
class PaymentIntentResponse(BaseModel):
    """Stripe Payment Intent response"""
    client_secret: str
    payment_intent_id: str
    status: str
    

class PayPalOrderResponse(BaseModel):
    """PayPal Order response"""
    paypal_order_id: str
    status: str
    approval_url: Optional[str] = None


class TransactionResponse(BaseModel):
    """Transaction details"""
    id: uuid.UUID
    type: TransactionType
    status: TransactionStatus
    amount: Decimal
    currency: Currency
    fee: Decimal
    net_amount: Decimal
    provider: PaymentProvider
    provider_transaction_id: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    extra_data: Optional[Dict[str, Any]] = None
    
    class Config:
        from_attributes = True


class WalletResponse(BaseModel):
    """Wallet balance"""
    balance: Decimal
    reserved_balance: Decimal
    available_balance: Decimal
    currency: Currency
    
    @validator("available_balance", pre=True, always=True)
    def calculate_available(cls, v, values):
        return values.get("balance", 0) - values.get("reserved_balance", 0)


class WalletTransactionResponse(BaseModel):
    """Wallet transaction"""
    id: uuid.UUID
    type: str
    amount: Decimal
    balance_after: Decimal
    description: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class SubscriptionResponse(BaseModel):
    """Subscription details"""
    id: uuid.UUID
    plan: str
    status: str
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    cancel_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PaymentMethodResponse(BaseModel):
    """Saved payment method"""
    id: uuid.UUID
    provider: str
    type: str
    last4: Optional[str] = None
    brand: Optional[str] = None
    exp_month: Optional[int] = None
    exp_year: Optional[int] = None
    is_default: bool
    
    class Config:
        from_attributes = True


class EscrowResponse(BaseModel):
    """Escrow hold details"""
    id: uuid.UUID
    amount: Decimal
    status: str
    release_date: Optional[datetime] = None
    released_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PayoutResponse(BaseModel):
    """Payout details"""
    id: uuid.UUID
    amount: Decimal
    currency: str
    status: str
    arrival_date: Optional[datetime] = None
    failure_reason: Optional[str] = None
    
    class Config:
        from_attributes = True


# Paginated responses
class PaginatedResponse(BaseModel):
    """Paginated list response"""
    items: List[Any]
    total: int
    limit: int
    offset: int
    has_more: bool


class TransactionListResponse(PaginatedResponse):
    """Paginated transactions"""
    items: List[TransactionResponse]


class WalletTransactionListResponse(PaginatedResponse):
    """Paginated wallet transactions"""
    items: List[WalletTransactionResponse]
