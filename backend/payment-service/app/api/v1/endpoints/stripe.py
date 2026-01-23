"""
Stripe API Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, Header
from typing import Optional
import uuid

from app.schemas.payment import (
    CreatePaymentIntentRequest,
    PaymentIntentResponse,
    MarketplacePaymentRequest,
    RefundRequest,
    TransactionResponse
)
from app.services.payment_service import PaymentService

router = APIRouter()


# Dependency injection placeholder (replace with actual DB session)
async def get_payment_service():
    # TODO: Inject actual database session
    # from app.core.database import get_db
    # db = await get_db()
    # return PaymentService(db)
    pass


@router.post("/intent", response_model=PaymentIntentResponse)
async def create_payment_intent(
    request: CreatePaymentIntentRequest,
    x_idempotency_key: Optional[str] = Header(None),
    # current_user = Depends(get_current_user),
    # payment_service: PaymentService = Depends(get_payment_service)
):
    """
    Create a Stripe Payment Intent for checkout.
    
    Returns client_secret for frontend confirmation.
    """
    try:
        # Validate currency
        if request.currency not in ["XOF", "EUR", "USD"]:
           raise ValueError("Invalid currency")

        # In real implementation:
        # payment_intent = await stripe_client.create_payment_intent(...)
        
        # Placeholder response
        return PaymentIntentResponse(
            client_secret="pi_test_secret_" + str(uuid.uuid4())[:8],
            payment_intent_id="pi_test_" + str(uuid.uuid4())[:8],
            status="requires_confirmation"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Payment creation failed")


@router.post("/marketplace")
async def create_marketplace_payment(
    request: MarketplacePaymentRequest,
    x_idempotency_key: Optional[str] = Header(None),
):
    """
    Create a marketplace split payment with escrow.
    
    Calculates:
    - Platform fee (10% default)
    - Provider fee (~2.9% + 30 XOF)
    - Seller amount (held in escrow)
    """
    try:
        # Calculate fees
        platform_fee = int(request.amount * (request.split_rule.get("platform_fee_percent", 10) / 100))
        provider_fee = int(request.amount * 0.029) + 30
        seller_amount = request.amount - platform_fee - provider_fee
        
        return {
            "transaction_id": str(uuid.uuid4()),
            "client_secret": "pi_test_secret_marketplace",
            "payment_intent_id": "pi_test_marketplace",
            "status": "requires_confirmation",
            "platform_fee": platform_fee,
            "seller_amount": seller_amount,
            "provider_fee": provider_fee,
            "escrow_created": request.split_rule.get("hold_in_escrow", True)
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{transaction_id}/capture")
async def capture_payment(transaction_id: uuid.UUID):
    """Capture an authorized payment (for manual capture mode)"""
    try:
        # In real implementation:
        # stripe_client.capture_payment_intent(str(transaction_id))
        return {
            "transaction_id": str(transaction_id),
            "status": "succeeded",
            "captured": True,
            "amount_captured": 50000 
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{transaction_id}/cancel")
async def cancel_payment(transaction_id: uuid.UUID):
    """Cancel a pending payment"""
    try:
        # In real implementation:
        # stripe_client.cancel_payment_intent(str(transaction_id))
        return {
            "transaction_id": str(transaction_id),
            "status": "canceled",
            "cancellation_reason": "user_requested"
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/{transaction_id}/refund")
async def create_refund(
    transaction_id: uuid.UUID,
    request: RefundRequest
):
    """Create a full or partial refund"""
    try:
        # In real implementation:
        # refund = stripe_client.create_refund(payment_intent=str(transaction_id), amount=request.amount)
        return {
            "refund_transaction_id": str(uuid.uuid4()),
            "original_transaction_id": str(transaction_id),
            "amount": request.amount or 50000,
            "reason": request.reason,
            "status": "succeeded",
            "provider_refund_id": "re_test_" + str(uuid.uuid4())[:8]
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{transaction_id}")
async def get_transaction(transaction_id: uuid.UUID):
    """Get transaction details"""
    try:
        # In real implementation:
        # db.query(Transaction).filter(...)
        return {
            "id": str(transaction_id),
            "status": "succeeded",
            "amount": 50000,
            "currency": "XOF",
            "provider": "stripe",
            "created_at": "2024-01-22T10:00:00Z"
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail="Transaction not found")
