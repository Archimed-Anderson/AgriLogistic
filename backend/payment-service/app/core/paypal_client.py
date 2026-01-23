"""
PayPal Client - REST API v2 Integration
"""
import httpx
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import structlog
import base64

from app.core.config import settings

logger = structlog.get_logger()


class PayPalClient:
    """Wrapper for PayPal REST API v2"""
    
    def __init__(self):
        self.client_id = settings.PAYPAL_CLIENT_ID
        self.client_secret = settings.PAYPAL_CLIENT_SECRET
        self.mode = settings.PAYPAL_MODE
        self.base_url = (
            "https://api-m.sandbox.paypal.com" 
            if self.mode == "sandbox" 
            else "https://api-m.paypal.com"
        )
        self._access_token: Optional[str] = None
        self._token_expires_at: Optional[datetime] = None
    
    async def _get_access_token(self) -> str:
        """Get or refresh OAuth 2.0 access token"""
        # Check if token is still valid
        if self._access_token and self._token_expires_at:
            if datetime.utcnow() < self._token_expires_at - timedelta(minutes=5):
                return self._access_token
        
        # Get new token
        auth_string = base64.b64encode(
            f"{self.client_id}:{self.client_secret}".encode()
        ).decode()
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/v1/oauth2/token",
                headers={
                    "Authorization": f"Basic {auth_string}",
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data={"grant_type": "client_credentials"}
            )
            response.raise_for_status()
            data = response.json()
            
            self._access_token = data["access_token"]
            self._token_expires_at = datetime.utcnow() + timedelta(
                seconds=data["expires_in"]
            )
            
            return self._access_token
    
    async def _request(
        self,
        method: str,
        endpoint: str,
        data: Optional[Dict[str, Any]] = None,
        params: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Make authenticated request to PayPal API"""
        token = await self._get_access_token()
        
        async with httpx.AsyncClient() as client:
            response = await client.request(
                method,
                f"{self.base_url}{endpoint}",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json"
                },
                json=data,
                params=params
            )
            response.raise_for_status()
            
            if response.status_code == 204:
                return {}
            return response.json()
    
    async def create_order(
        self,
        amount: float,
        currency: str,
        order_id: str,
        description: str = "AgroLogistic Purchase",
        return_url: str = None,
        cancel_url: str = None
    ) -> Dict[str, Any]:
        """Create a PayPal order for checkout"""
        try:
            payload = {
                "intent": "CAPTURE",
                "purchase_units": [{
                    "reference_id": order_id,
                    "description": description,
                    "amount": {
                        "currency_code": currency.upper(),
                        "value": f"{amount:.2f}"
                    }
                }],
                "payment_source": {
                    "paypal": {
                        "experience_context": {
                            "payment_method_preference": "IMMEDIATE_PAYMENT_REQUIRED",
                            "brand_name": "AgroLogistic",
                            "locale": "fr-FR",
                            "landing_page": "LOGIN",
                            "user_action": "PAY_NOW",
                            "return_url": return_url or "https://agrologistic.com/checkout/success",
                            "cancel_url": cancel_url or "https://agrologistic.com/checkout/cancel"
                        }
                    }
                }
            }
            
            result = await self._request("POST", "/v2/checkout/orders", data=payload)
            
            # Extract approval URL
            approval_url = None
            for link in result.get("links", []):
                if link["rel"] == "payer-action":
                    approval_url = link["href"]
                    break
            
            logger.info("paypal_order_created", 
                       order_id=result["id"],
                       status=result["status"])
            
            return {
                "paypal_order_id": result["id"],
                "status": result["status"],
                "approval_url": approval_url,
                "links": result.get("links", [])
            }
        except httpx.HTTPStatusError as e:
            logger.error("paypal_create_order_failed", error=str(e))
            raise
    
    async def capture_order(self, paypal_order_id: str) -> Dict[str, Any]:
        """Capture an approved PayPal order"""
        try:
            result = await self._request(
                "POST", 
                f"/v2/checkout/orders/{paypal_order_id}/capture"
            )
            
            logger.info("paypal_order_captured", 
                       order_id=paypal_order_id,
                       status=result["status"])
            
            # Extract capture details
            capture_id = None
            amount = None
            if result.get("purchase_units"):
                captures = result["purchase_units"][0].get("payments", {}).get("captures", [])
                if captures:
                    capture_id = captures[0]["id"]
                    amount = captures[0]["amount"]
            
            return {
                "paypal_order_id": result["id"],
                "status": result["status"],
                "capture_id": capture_id,
                "amount": amount,
                "payer": result.get("payer", {})
            }
        except httpx.HTTPStatusError as e:
            logger.error("paypal_capture_order_failed", 
                        order_id=paypal_order_id, 
                        error=str(e))
            raise
    
    async def get_order(self, paypal_order_id: str) -> Dict[str, Any]:
        """Get order details"""
        try:
            result = await self._request(
                "GET", 
                f"/v2/checkout/orders/{paypal_order_id}"
            )
            return result
        except httpx.HTTPStatusError as e:
            logger.error("paypal_get_order_failed", 
                        order_id=paypal_order_id, 
                        error=str(e))
            raise
    
    async def create_refund(
        self,
        capture_id: str,
        amount: Optional[float] = None,
        currency: str = "EUR",
        note: Optional[str] = None
    ) -> Dict[str, Any]:
        """Refund a captured payment"""
        try:
            payload = {}
            if amount:
                payload["amount"] = {
                    "currency_code": currency.upper(),
                    "value": f"{amount:.2f}"
                }
            if note:
                payload["note_to_payer"] = note
            
            result = await self._request(
                "POST",
                f"/v2/payments/captures/{capture_id}/refund",
                data=payload if payload else None
            )
            
            logger.info("paypal_refund_created", 
                       refund_id=result["id"],
                       status=result["status"])
            
            return {
                "refund_id": result["id"],
                "status": result["status"],
                "amount": result.get("amount"),
                "capture_id": capture_id
            }
        except httpx.HTTPStatusError as e:
            logger.error("paypal_refund_failed", 
                        capture_id=capture_id, 
                        error=str(e))
            raise
    
    async def create_subscription(
        self,
        plan_id: str,
        subscriber_email: str,
        subscriber_name: str,
        return_url: str = None,
        cancel_url: str = None
    ) -> Dict[str, Any]:
        """Create a subscription"""
        try:
            payload = {
                "plan_id": plan_id,
                "subscriber": {
                    "name": {
                        "given_name": subscriber_name.split()[0],
                        "surname": subscriber_name.split()[-1] if len(subscriber_name.split()) > 1 else ""
                    },
                    "email_address": subscriber_email
                },
                "application_context": {
                    "brand_name": "AgroLogistic",
                    "locale": "fr-FR",
                    "user_action": "SUBSCRIBE_NOW",
                    "return_url": return_url or "https://agrologistic.com/subscription/success",
                    "cancel_url": cancel_url or "https://agrologistic.com/subscription/cancel"
                }
            }
            
            result = await self._request(
                "POST",
                "/v1/billing/subscriptions",
                data=payload
            )
            
            # Extract approval URL
            approval_url = None
            for link in result.get("links", []):
                if link["rel"] == "approve":
                    approval_url = link["href"]
                    break
            
            logger.info("paypal_subscription_created", 
                       subscription_id=result["id"],
                       status=result["status"])
            
            return {
                "subscription_id": result["id"],
                "status": result["status"],
                "approval_url": approval_url
            }
        except httpx.HTTPStatusError as e:
            logger.error("paypal_subscription_failed", error=str(e))
            raise
    
    async def cancel_subscription(
        self,
        subscription_id: str,
        reason: str = "User requested cancellation"
    ) -> Dict[str, Any]:
        """Cancel a subscription"""
        try:
            await self._request(
                "POST",
                f"/v1/billing/subscriptions/{subscription_id}/cancel",
                data={"reason": reason}
            )
            
            logger.info("paypal_subscription_canceled", 
                       subscription_id=subscription_id)
            
            return {"subscription_id": subscription_id, "status": "CANCELLED"}
        except httpx.HTTPStatusError as e:
            logger.error("paypal_cancel_subscription_failed", 
                        subscription_id=subscription_id, 
                        error=str(e))
            raise
    
    async def verify_webhook_signature(
        self,
        transmission_id: str,
        timestamp: str,
        webhook_id: str,
        event_body: str,
        cert_url: str,
        auth_algo: str,
        transmission_sig: str
    ) -> bool:
        """Verify PayPal webhook signature"""
        try:
            payload = {
                "transmission_id": transmission_id,
                "transmission_time": timestamp,
                "cert_url": cert_url,
                "auth_algo": auth_algo,
                "transmission_sig": transmission_sig,
                "webhook_id": webhook_id,
                "webhook_event": event_body
            }
            
            result = await self._request(
                "POST",
                "/v1/notifications/verify-webhook-signature",
                data=payload
            )
            
            return result.get("verification_status") == "SUCCESS"
        except Exception as e:
            logger.error("paypal_webhook_verify_failed", error=str(e))
            return False


# Export singleton
paypal_client = PayPalClient()
