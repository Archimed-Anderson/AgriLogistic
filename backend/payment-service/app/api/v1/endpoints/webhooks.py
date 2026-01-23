"""Webhooks API Endpoints - Stripe and PayPal"""
from fastapi import APIRouter, Request, HTTPException, Header
import structlog

from app.core.stripe_client import stripe_client
from app.core.config import settings

router = APIRouter()
logger = structlog.get_logger()


@router.post("/stripe")
async def stripe_webhook(
    request: Request,
    stripe_signature: str = Header(alias="Stripe-Signature")
):
    """Handle Stripe webhook events"""
    payload = await request.body()
    
    try:
        event = stripe_client.verify_webhook_signature(payload, stripe_signature)
    except Exception as e:
        logger.error("stripe_webhook_invalid_signature", error=str(e))
        raise HTTPException(status_code=400, detail="Invalid signature")
    
    event_type = event["type"]
    logger.info("stripe_webhook_received", event_type=event_type, event_id=event["id"])
    
    # Handle events
    # Handle events
    if event_type == "payment_intent.succeeded":
        logger.info("payment_succeeded", intent_id=event["data"]["object"]["id"])
        # Logic to mark transaction as succeeded
    elif event_type == "payment_intent.payment_failed":
        logger.warning("payment_failed", intent_id=event["data"]["object"]["id"])
        # Logic to mark transaction as failed
    elif event_type == "charge.refunded":
        logger.info("charge_refunded", charge_id=event["data"]["object"]["id"])
        # Logic to record refund
    elif event_type == "customer.subscription.created":
        logger.info("subscription_created", sub_id=event["data"]["object"]["id"])
    elif event_type == "customer.subscription.deleted":
        logger.info("subscription_deleted", sub_id=event["data"]["object"]["id"])
    elif event_type == "charge.dispute.created":
        logger.critical("dispute_created", charge_id=event["data"]["object"]["id"])
    
    return {"received": True}


@router.post("/paypal")
async def paypal_webhook(
    request: Request,
    paypal_transmission_id: str = Header(alias="PAYPAL-TRANSMISSION-ID"),
    paypal_transmission_sig: str = Header(alias="PAYPAL-TRANSMISSION-SIG"),
    paypal_cert_url: str = Header(alias="PAYPAL-CERT-URL"),
    paypal_auth_algo: str = Header(alias="PAYPAL-AUTH-ALGO"),
    paypal_transmission_time: str = Header(alias="PAYPAL-TRANSMISSION-TIME")
):
    """Handle PayPal webhook events"""
    payload = await request.json()
    
    # TODO: Verify signature with paypal_client.verify_webhook_signature()
    
    event_type = payload.get("event_type")
    logger.info("paypal_webhook_received", event_type=event_type)
    
    if event_type == "PAYMENT.CAPTURE.COMPLETED":
        logger.info("paypal_capture_completed", resource_id=payload.get("resource", {}).get("id"))
    elif event_type == "PAYMENT.CAPTURE.REFUNDED":
        logger.info("paypal_refunded", resource_id=payload.get("resource", {}).get("id"))
    elif event_type == "BILLING.SUBSCRIPTION.ACTIVATED":
        logger.info("paypal_sub_activated", sub_id=payload.get("resource", {}).get("id"))
    elif event_type == "BILLING.SUBSCRIPTION.CANCELLED":
        logger.info("paypal_sub_cancelled", sub_id=payload.get("resource", {}).get("id"))
    
    return {"received": True}
