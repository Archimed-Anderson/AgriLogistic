"""
Escrow Service - Marketplace escrow management
"""
from decimal import Decimal
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from app.core.config import settings
from app.models import EscrowHold, Transaction, Payout

logger = structlog.get_logger()


class EscrowService:
    """Escrow management for marketplace transactions"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_hold(
        self,
        transaction_id: uuid.UUID,
        order_id: uuid.UUID,
        seller_id: uuid.UUID,
        amount: Decimal,
        auto_release_days: int = None
    ) -> EscrowHold:
        """Create an escrow hold for funds"""
        release_days = auto_release_days or settings.ESCROW_AUTO_RELEASE_DAYS
        release_date = datetime.utcnow() + timedelta(days=release_days)
        
        escrow = EscrowHold(
            transaction_id=transaction_id,
            order_id=order_id,
            seller_id=seller_id,
            amount=amount,
            status="held",
            release_date=release_date
        )
        self.db.add(escrow)
        await self.db.commit()
        await self.db.refresh(escrow)
        
        logger.info("escrow_hold_created",
                   escrow_id=str(escrow.id),
                   order_id=str(order_id),
                   amount=float(amount),
                   release_date=release_date.isoformat())
        
        return escrow
    
    async def release_funds(
        self,
        escrow_id: uuid.UUID,
        reason: str = "manual_release"
    ) -> dict:
        """Release escrowed funds to seller"""
        escrow = await self.db.get(EscrowHold, escrow_id)
        
        if not escrow:
            raise ValueError("Escrow hold not found")
        
        if escrow.status != "held":
            raise ValueError(f"Cannot release escrow with status: {escrow.status}")
        
        # Create payout transaction
        payout = Payout(
            seller_id=escrow.seller_id,
            amount=escrow.amount,
            currency="XOF",
            status="pending",
            provider="stripe",  # Or based on seller preference
        )
        self.db.add(payout)
        
        # Update escrow
        escrow.status = "released"
        escrow.released_at = datetime.utcnow()
        
        # Create release transaction record
        release_transaction = Transaction(
            user_id=escrow.seller_id,
            order_id=escrow.order_id,
            type="payout",
            status="pending",
            amount=escrow.amount,
            currency="XOF",
            provider="internal",
            metadata={
                "escrow_id": str(escrow_id),
                "reason": reason
            }
        )
        self.db.add(release_transaction)
        
        await self.db.commit()
        
        logger.info("escrow_funds_released",
                   escrow_id=str(escrow_id),
                   seller_id=str(escrow.seller_id),
                   amount=float(escrow.amount),
                   payout_id=str(payout.id))
        
        return {
            "escrow_id": str(escrow_id),
            "payout_id": str(payout.id),
            "amount": float(escrow.amount),
            "status": "released",
            "released_at": escrow.released_at.isoformat()
        }
    
    async def refund_escrow(
        self,
        escrow_id: uuid.UUID,
        reason: str = "buyer_requested_refund"
    ) -> dict:
        """Refund escrowed funds to buyer"""
        escrow = await self.db.get(EscrowHold, escrow_id)
        
        if not escrow:
            raise ValueError("Escrow hold not found")
        
        if escrow.status != "held":
            raise ValueError(f"Cannot refund escrow with status: {escrow.status}")
        
        # Get original transaction
        original_tx = await self.db.get(Transaction, escrow.transaction_id)
        if not original_tx:
            raise ValueError("Original transaction not found")
        
        # Update escrow
        escrow.status = "refunded"
        escrow.released_at = datetime.utcnow()
        
        await self.db.commit()
        
        logger.info("escrow_refunded",
                   escrow_id=str(escrow_id),
                   order_id=str(escrow.order_id),
                   amount=float(escrow.amount),
                   reason=reason)
        
        return {
            "escrow_id": str(escrow_id),
            "buyer_id": str(original_tx.user_id),
            "amount": float(escrow.amount),
            "status": "refunded",
            "reason": reason
        }
    
    async def get_escrow(self, escrow_id: uuid.UUID) -> Optional[EscrowHold]:
        """Get escrow by ID"""
        return await self.db.get(EscrowHold, escrow_id)
    
    async def get_escrow_by_order(self, order_id: uuid.UUID) -> Optional[EscrowHold]:
        """Get escrow by order ID"""
        result = await self.db.execute(
            select(EscrowHold).where(EscrowHold.order_id == order_id)
        )
        return result.scalar_one_or_none()
    
    async def list_seller_escrows(
        self,
        seller_id: uuid.UUID,
        status: Optional[str] = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[EscrowHold]:
        """List escrows for a seller"""
        query = select(EscrowHold).where(EscrowHold.seller_id == seller_id)
        
        if status:
            query = query.where(EscrowHold.status == status)
        
        query = query.order_by(EscrowHold.created_at.desc()).limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def get_pending_releases(self) -> List[EscrowHold]:
        """Get escrows ready for auto-release"""
        result = await self.db.execute(
            select(EscrowHold).where(
                and_(
                    EscrowHold.status == "held",
                    EscrowHold.release_date <= datetime.utcnow()
                )
            )
        )
        return result.scalars().all()
    
    async def process_auto_releases(self) -> int:
        """Process all escrows ready for auto-release (cron job)"""
        pending = await self.get_pending_releases()
        released_count = 0
        
        for escrow in pending:
            try:
                await self.release_funds(escrow.id, reason="auto_release")
                released_count += 1
            except Exception as e:
                logger.error("auto_release_failed",
                           escrow_id=str(escrow.id),
                           error=str(e))
        
        logger.info("auto_release_completed",
                   total_processed=len(pending),
                   released=released_count)
        
        return released_count
    
    async def extend_hold(
        self,
        escrow_id: uuid.UUID,
        additional_days: int
    ) -> EscrowHold:
        """Extend escrow hold period (for disputes)"""
        escrow = await self.db.get(EscrowHold, escrow_id)
        
        if not escrow:
            raise ValueError("Escrow hold not found")
        
        if escrow.status != "held":
            raise ValueError("Can only extend active holds")
        
        escrow.release_date = escrow.release_date + timedelta(days=additional_days)
        await self.db.commit()
        
        logger.info("escrow_extended",
                   escrow_id=str(escrow_id),
                   additional_days=additional_days,
                   new_release_date=escrow.release_date.isoformat())
        
        return escrow
