"""Wallet API Endpoints"""
from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from decimal import Decimal
import uuid

from app.schemas.payment import (
    WalletResponse, WalletTopUpRequest, WalletWithdrawRequest, WalletTransferRequest
)

router = APIRouter()


@router.get("", response_model=WalletResponse)
async def get_wallet_balance():
    """Get user's wallet balance"""
    return WalletResponse(
        balance=Decimal("25000.00"),
        reserved_balance=Decimal("5000.00"),
        available_balance=Decimal("20000.00"),
        currency="XOF"
    )


@router.post("/top-up")
async def top_up_wallet(request: WalletTopUpRequest):
    """Top up wallet with card or mobile money"""
    return {"transaction_id": str(uuid.uuid4()), "amount": request.amount, "status": "processing"}


@router.post("/withdraw")
async def withdraw_from_wallet(request: WalletWithdrawRequest):
    """Withdraw funds to bank account. Min: 1000 XOF"""
    return {"transaction_id": str(uuid.uuid4()), "amount": request.amount, "status": "pending"}


@router.post("/transfer")
async def transfer_funds(request: WalletTransferRequest):
    """Transfer funds to another user's wallet. Max: 500,000 XOF"""
    return {"transfer_id": str(uuid.uuid4()), "amount": request.amount, "status": "completed"}


@router.get("/transactions")
async def get_wallet_transactions(
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    type: Optional[str] = None
):
    """Get wallet transaction history"""
    return {"items": [], "total": 0, "limit": limit, "offset": offset, "has_more": False}
