"""
Payment Service - Core business logic for payments
"""
from decimal import Decimal
from typing import Optional, Dict, Any
from datetime import datetime
import uuid
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update

from app.core.stripe_client import stripe_client
from app.core.paypal_client import paypal_client
from app.core.config import settings
from app.models import Transaction, PaymentMethod, EscrowHold, SplitPaymentRule

logger = structlog.get_logger()


class PaymentService:
    """Core payment processing service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_stripe_payment_intent(
        self,
        user_id: uuid.UUID,
        amount: int,
        currency: str,
        order_id: Optional[uuid.UUID] = None,
        payment_method_id: Optional[uuid.UUID] = None,
        save_payment_method: bool = False,
        metadata: Optional[Dict[str, Any]] = None,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a Stripe Payment Intent"""
        
        # Check idempotency
        if idempotency_key:
            existing = await self._check_idempotency(idempotency_key)
            if existing:
                return existing
        
        # Get provider payment method if saved
        provider_pm_id = None
        if payment_method_id:
            pm = await self.db.get(PaymentMethod, payment_method_id)
            if pm and pm.user_id == user_id:
                provider_pm_id = pm.provider_payment_method_id
        
        # Build metadata
        full_metadata = {
            "user_id": str(user_id),
            "order_id": str(order_id) if order_id else None,
            **(metadata or {})
        }
        
        # Create Stripe Payment Intent
        intent = await stripe_client.create_payment_intent(
            amount=amount,
            currency=currency,
            metadata=full_metadata,
            payment_method=provider_pm_id
        )
        
        # Create transaction record
        transaction = Transaction(
            idempotency_key=idempotency_key,
            user_id=user_id,
            order_id=order_id,
            type="payment",
            status="pending",
            amount=Decimal(amount) / 100 if currency.upper() in ["EUR", "USD"] else Decimal(amount),
            currency=currency.upper(),
            provider="stripe",
            provider_transaction_id=intent.id,
            metadata=full_metadata
        )
        self.db.add(transaction)
        await self.db.commit()
        
        logger.info("stripe_payment_intent_created",
                   transaction_id=str(transaction.id),
                   intent_id=intent.id,
                   amount=amount)
        
        return {
            "transaction_id": str(transaction.id),
            "client_secret": intent.client_secret,
            "payment_intent_id": intent.id,
            "status": intent.status
        }
    
    async def create_paypal_order(
        self,
        user_id: uuid.UUID,
        amount: Decimal,
        currency: str,
        order_id: uuid.UUID,
        description: str = "AgroLogistic Purchase",
        return_url: Optional[str] = None,
        cancel_url: Optional[str] = None,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a PayPal Order"""
        
        # Check idempotency
        if idempotency_key:
            existing = await self._check_idempotency(idempotency_key)
            if existing:
                return existing
        
        # Create PayPal order
        paypal_order = await paypal_client.create_order(
            amount=float(amount),
            currency=currency,
            order_id=str(order_id),
            description=description,
            return_url=return_url,
            cancel_url=cancel_url
        )
        
        # Create transaction record
        transaction = Transaction(
            idempotency_key=idempotency_key,
            user_id=user_id,
            order_id=order_id,
            type="payment",
            status="pending",
            amount=amount,
            currency=currency.upper(),
            provider="paypal",
            provider_transaction_id=paypal_order["paypal_order_id"],
            metadata={"description": description}
        )
        self.db.add(transaction)
        await self.db.commit()
        
        logger.info("paypal_order_created",
                   transaction_id=str(transaction.id),
                   paypal_order_id=paypal_order["paypal_order_id"])
        
        return {
            "transaction_id": str(transaction.id),
            **paypal_order
        }
    
    async def capture_paypal_order(
        self,
        paypal_order_id: str
    ) -> Dict[str, Any]:
        """Capture an approved PayPal order"""
        
        # Find transaction
        result = await self.db.execute(
            select(Transaction).where(
                Transaction.provider_transaction_id == paypal_order_id,
                Transaction.provider == "paypal"
            )
        )
        transaction = result.scalar_one_or_none()
        
        if not transaction:
            raise ValueError(f"Transaction not found for PayPal order {paypal_order_id}")
        
        # Capture on PayPal
        capture_result = await paypal_client.capture_order(paypal_order_id)
        
        # Update transaction
        transaction.status = "succeeded" if capture_result["status"] == "COMPLETED" else "failed"
        transaction.completed_at = datetime.utcnow()
        transaction.metadata = {
            **(transaction.metadata or {}),
            "capture_id": capture_result.get("capture_id"),
            "payer": capture_result.get("payer")
        }
        await self.db.commit()
        
        logger.info("paypal_order_captured",
                   transaction_id=str(transaction.id),
                   status=transaction.status)
        
        return {
            "transaction_id": str(transaction.id),
            "status": transaction.status,
            **capture_result
        }
    
    async def create_marketplace_payment(
        self,
        user_id: uuid.UUID,
        order_id: uuid.UUID,
        amount: int,
        seller_id: uuid.UUID,
        payment_method_id: uuid.UUID,
        platform_fee_percent: Decimal = Decimal("10.0"),
        hold_in_escrow: bool = True,
        auto_release_days: int = 7,
        idempotency_key: Optional[str] = None
    ) -> Dict[str, Any]:
        """Create a marketplace split payment with escrow"""
        
        # Calculate fees
        platform_fee = int(amount * float(platform_fee_percent) / 100)
        provider_fee = int(amount * 0.029) + 30  # ~2.9% + 30 XOF
        seller_amount = amount - platform_fee - provider_fee
        
        # Create payment intent
        payment_result = await self.create_stripe_payment_intent(
            user_id=user_id,
            amount=amount,
            currency="XOF",
            order_id=order_id,
            payment_method_id=payment_method_id,
            metadata={
                "seller_id": str(seller_id),
                "platform_fee": platform_fee,
                "seller_amount": seller_amount,
                "is_marketplace": True
            },
            idempotency_key=idempotency_key
        )
        
        # Get transaction
        transaction = await self.db.get(Transaction, uuid.UUID(payment_result["transaction_id"]))
        transaction.fee = Decimal(platform_fee)
        transaction.net_amount = Decimal(seller_amount)
        
        # Create escrow hold if requested
        if hold_in_escrow:
            from datetime import timedelta
            escrow = EscrowHold(
                transaction_id=transaction.id,
                order_id=order_id,
                seller_id=seller_id,
                amount=Decimal(seller_amount),
                status="held",
                release_date=datetime.utcnow() + timedelta(days=auto_release_days)
            )
            self.db.add(escrow)
        
        await self.db.commit()
        
        logger.info("marketplace_payment_created",
                   transaction_id=str(transaction.id),
                   platform_fee=platform_fee,
                   seller_amount=seller_amount,
                   escrow=hold_in_escrow)
        
        return {
            **payment_result,
            "platform_fee": platform_fee,
            "seller_amount": seller_amount,
            "provider_fee": provider_fee,
            "escrow_created": hold_in_escrow
        }
    
    async def process_refund(
        self,
        transaction_id: uuid.UUID,
        amount: Optional[int] = None,
        reason: str = "requested_by_customer"
    ) -> Dict[str, Any]:
        """Process a refund for a transaction"""
        
        transaction = await self.db.get(Transaction, transaction_id)
        if not transaction:
            raise ValueError("Transaction not found")
        
        if transaction.status != "succeeded":
            raise ValueError("Can only refund succeeded transactions")
        
        if transaction.provider == "stripe":
            refund = await stripe_client.create_refund(
                payment_intent_id=transaction.provider_transaction_id,
                amount=amount,
                reason=reason
            )
            refund_id = refund.id
        elif transaction.provider == "paypal":
            capture_id = transaction.metadata.get("capture_id")
            if not capture_id:
                raise ValueError("No capture ID found for PayPal refund")
            refund_result = await paypal_client.create_refund(
                capture_id=capture_id,
                amount=float(amount) / 100 if amount else None,
                currency=transaction.currency
            )
            refund_id = refund_result["refund_id"]
        else:
            raise ValueError(f"Refund not supported for provider: {transaction.provider}")
        
        # Create refund transaction
        refund_amount = Decimal(amount) if amount else transaction.amount
        refund_transaction = Transaction(
            user_id=transaction.user_id,
            order_id=transaction.order_id,
            type="refund",
            status="succeeded",
            amount=refund_amount,
            currency=transaction.currency,
            provider=transaction.provider,
            provider_transaction_id=refund_id,
            metadata={
                "original_transaction_id": str(transaction_id),
                "reason": reason
            },
            completed_at=datetime.utcnow()
        )
        self.db.add(refund_transaction)
        
        # Update original transaction if fully refunded
        if not amount or amount >= float(transaction.amount):
            transaction.status = "refunded"
        
        await self.db.commit()
        
        logger.info("refund_processed",
                   original_transaction_id=str(transaction_id),
                   refund_transaction_id=str(refund_transaction.id),
                   amount=float(refund_amount))
        
        return {
            "refund_transaction_id": str(refund_transaction.id),
            "refund_id": refund_id,
            "amount": float(refund_amount),
            "status": "succeeded"
        }
    
    async def _check_idempotency(self, key: str) -> Optional[Dict[str, Any]]:
        """Check if idempotency key was already used"""
        result = await self.db.execute(
            select(Transaction).where(Transaction.idempotency_key == key)
        )
        existing = result.scalar_one_or_none()
        
        if existing:
            return {
                "transaction_id": str(existing.id),
                "status": existing.status,
                "provider_transaction_id": existing.provider_transaction_id,
                "idempotent": True
            }
        return None
    
    async def get_transaction(self, transaction_id: uuid.UUID) -> Optional[Transaction]:
        """Get transaction by ID"""
        return await self.db.get(Transaction, transaction_id)
    
    async def list_transactions(
        self,
        user_id: uuid.UUID,
        limit: int = 50,
        offset: int = 0,
        status: Optional[str] = None,
        type: Optional[str] = None
    ) -> list:
        """List user transactions"""
        query = select(Transaction).where(Transaction.user_id == user_id)
        
        if status:
            query = query.where(Transaction.status == status)
        if type:
            query = query.where(Transaction.type == type)
        
        query = query.order_by(Transaction.created_at.desc()).limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return result.scalars().all()
