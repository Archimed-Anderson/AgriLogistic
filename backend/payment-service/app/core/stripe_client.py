"""
Stripe Client - SDK Wrapper for Stripe API
"""
import stripe
from typing import Optional, Dict, Any
from decimal import Decimal
import structlog

from app.core.config import settings

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY
logger = structlog.get_logger()


class StripeClient:
    """Wrapper for Stripe SDK operations"""
    
    @staticmethod
    async def create_customer(
        email: str,
        name: str,
        metadata: Optional[Dict[str, Any]] = None
    ) -> stripe.Customer:
        """Create a new Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata=metadata or {}
            )
            logger.info("stripe_customer_created", customer_id=customer.id)
            return customer
        except stripe.error.StripeError as e:
            logger.error("stripe_customer_creation_failed", error=str(e))
            raise
    
    @staticmethod
    async def create_payment_intent(
        amount: int,
        currency: str,
        metadata: Dict[str, Any],
        customer_id: Optional[str] = None,
        payment_method: Optional[str] = None,
        confirm: bool = False,
        capture_method: str = "automatic"
    ) -> stripe.PaymentIntent:
        """Create a Payment Intent for checkout"""
        try:
            params = {
                "amount": amount,
                "currency": currency.lower(),
                "metadata": metadata,
                "confirm": confirm,
                "capture_method": capture_method,
                "automatic_payment_methods": {"enabled": True}
            }
            
            if customer_id:
                params["customer"] = customer_id
            if payment_method:
                params["payment_method"] = payment_method
                
            intent = stripe.PaymentIntent.create(**params)
            logger.info("stripe_payment_intent_created", 
                       intent_id=intent.id, 
                       amount=amount, 
                       currency=currency)
            return intent
        except stripe.error.StripeError as e:
            logger.error("stripe_payment_intent_failed", error=str(e))
            raise
    
    @staticmethod
    async def confirm_payment_intent(
        payment_intent_id: str,
        payment_method: Optional[str] = None
    ) -> stripe.PaymentIntent:
        """Confirm a Payment Intent"""
        try:
            params = {}
            if payment_method:
                params["payment_method"] = payment_method
                
            intent = stripe.PaymentIntent.confirm(payment_intent_id, **params)
            logger.info("stripe_payment_intent_confirmed", intent_id=intent.id)
            return intent
        except stripe.error.StripeError as e:
            logger.error("stripe_confirm_failed", intent_id=payment_intent_id, error=str(e))
            raise
    
    @staticmethod
    async def capture_payment_intent(
        payment_intent_id: str,
        amount_to_capture: Optional[int] = None
    ) -> stripe.PaymentIntent:
        """Capture a Payment Intent (for manual capture)"""
        try:
            params = {}
            if amount_to_capture:
                params["amount_to_capture"] = amount_to_capture
                
            intent = stripe.PaymentIntent.capture(payment_intent_id, **params)
            logger.info("stripe_payment_captured", intent_id=intent.id)
            return intent
        except stripe.error.StripeError as e:
            logger.error("stripe_capture_failed", intent_id=payment_intent_id, error=str(e))
            raise
    
    @staticmethod
    async def cancel_payment_intent(payment_intent_id: str) -> stripe.PaymentIntent:
        """Cancel a Payment Intent"""
        try:
            intent = stripe.PaymentIntent.cancel(payment_intent_id)
            logger.info("stripe_payment_canceled", intent_id=intent.id)
            return intent
        except stripe.error.StripeError as e:
            logger.error("stripe_cancel_failed", intent_id=payment_intent_id, error=str(e))
            raise
    
    @staticmethod
    async def create_refund(
        payment_intent_id: str,
        amount: Optional[int] = None,
        reason: str = "requested_by_customer"
    ) -> stripe.Refund:
        """Create a refund for a payment"""
        try:
            params = {
                "payment_intent": payment_intent_id,
                "reason": reason
            }
            if amount:
                params["amount"] = amount
                
            refund = stripe.Refund.create(**params)
            logger.info("stripe_refund_created", refund_id=refund.id, amount=amount)
            return refund
        except stripe.error.StripeError as e:
            logger.error("stripe_refund_failed", intent_id=payment_intent_id, error=str(e))
            raise
    
    @staticmethod
    async def create_transfer(
        amount: int,
        destination_account: str,
        currency: str = "xof",
        metadata: Optional[Dict[str, Any]] = None
    ) -> stripe.Transfer:
        """Create a transfer to a connected account (for marketplace)"""
        try:
            transfer = stripe.Transfer.create(
                amount=amount,
                currency=currency.lower(),
                destination=destination_account,
                metadata=metadata or {}
            )
            logger.info("stripe_transfer_created", 
                       transfer_id=transfer.id, 
                       destination=destination_account)
            return transfer
        except stripe.error.StripeError as e:
            logger.error("stripe_transfer_failed", error=str(e))
            raise
    
    @staticmethod
    async def create_payout(
        amount: int,
        currency: str = "xof",
        destination: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> stripe.Payout:
        """Create a payout to bank account"""
        try:
            params = {
                "amount": amount,
                "currency": currency.lower(),
                "metadata": metadata or {}
            }
            if destination:
                params["destination"] = destination
                
            payout = stripe.Payout.create(**params)
            logger.info("stripe_payout_created", payout_id=payout.id, amount=amount)
            return payout
        except stripe.error.StripeError as e:
            logger.error("stripe_payout_failed", error=str(e))
            raise
    
    @staticmethod
    async def attach_payment_method(
        payment_method_id: str,
        customer_id: str
    ) -> stripe.PaymentMethod:
        """Attach a payment method to a customer"""
        try:
            pm = stripe.PaymentMethod.attach(
                payment_method_id,
                customer=customer_id
            )
            logger.info("stripe_payment_method_attached", 
                       pm_id=pm.id, 
                       customer_id=customer_id)
            return pm
        except stripe.error.StripeError as e:
            logger.error("stripe_attach_pm_failed", error=str(e))
            raise
    
    @staticmethod
    async def detach_payment_method(payment_method_id: str) -> stripe.PaymentMethod:
        """Detach a payment method from customer"""
        try:
            pm = stripe.PaymentMethod.detach(payment_method_id)
            logger.info("stripe_payment_method_detached", pm_id=pm.id)
            return pm
        except stripe.error.StripeError as e:
            logger.error("stripe_detach_pm_failed", error=str(e))
            raise
    
    @staticmethod
    async def list_payment_methods(
        customer_id: str,
        type: str = "card"
    ) -> list:
        """List customer's payment methods"""
        try:
            payment_methods = stripe.PaymentMethod.list(
                customer=customer_id,
                type=type
            )
            return payment_methods.data
        except stripe.error.StripeError as e:
            logger.error("stripe_list_pm_failed", error=str(e))
            raise
    
    @staticmethod
    async def create_subscription(
        customer_id: str,
        price_id: str,
        trial_period_days: Optional[int] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> stripe.Subscription:
        """Create a subscription"""
        try:
            params = {
                "customer": customer_id,
                "items": [{"price": price_id}],
                "payment_behavior": "default_incomplete",
                "expand": ["latest_invoice.payment_intent"],
                "metadata": metadata or {}
            }
            if trial_period_days:
                params["trial_period_days"] = trial_period_days
                
            subscription = stripe.Subscription.create(**params)
            logger.info("stripe_subscription_created", sub_id=subscription.id)
            return subscription
        except stripe.error.StripeError as e:
            logger.error("stripe_subscription_failed", error=str(e))
            raise
    
    @staticmethod
    async def cancel_subscription(
        subscription_id: str,
        at_period_end: bool = True
    ) -> stripe.Subscription:
        """Cancel a subscription"""
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = stripe.Subscription.cancel(subscription_id)
            logger.info("stripe_subscription_canceled", sub_id=subscription_id)
            return subscription
        except stripe.error.StripeError as e:
            logger.error("stripe_cancel_sub_failed", error=str(e))
            raise
    
    @staticmethod
    def verify_webhook_signature(
        payload: bytes,
        signature: str
    ) -> stripe.Event:
        """Verify webhook signature and return event"""
        try:
            event = stripe.Webhook.construct_event(
                payload,
                signature,
                settings.STRIPE_WEBHOOK_SECRET
            )
            return event
        except stripe.error.SignatureVerificationError as e:
            logger.error("stripe_webhook_signature_invalid", error=str(e))
            raise
        except ValueError as e:
            logger.error("stripe_webhook_payload_invalid", error=str(e))
            raise


# Export singleton
stripe_client = StripeClient()
