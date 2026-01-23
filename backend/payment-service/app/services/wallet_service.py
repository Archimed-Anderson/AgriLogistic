"""
Wallet Service - Virtual wallet management
"""
from decimal import Decimal
from typing import Optional, List
from datetime import datetime
import uuid
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload

from app.core.config import settings
from app.models import Wallet, WalletTransaction, Transaction

logger = structlog.get_logger()


class WalletService:
    """Virtual wallet management service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def get_or_create_wallet(self, user_id: uuid.UUID) -> Wallet:
        """Get user's wallet or create one"""
        result = await self.db.execute(
            select(Wallet).where(Wallet.user_id == user_id)
        )
        wallet = result.scalar_one_or_none()
        
        if not wallet:
            wallet = Wallet(user_id=user_id, balance=Decimal("0"), currency="XOF")
            self.db.add(wallet)
            await self.db.commit()
            await self.db.refresh(wallet)
            logger.info("wallet_created", user_id=str(user_id))
        
        return wallet
    
    async def get_balance(self, user_id: uuid.UUID) -> dict:
        """Get wallet balance"""
        wallet = await self.get_or_create_wallet(user_id)
        available = wallet.balance - wallet.reserved_balance
        
        return {
            "balance": float(wallet.balance),
            "reserved_balance": float(wallet.reserved_balance),
            "available_balance": float(available),
            "currency": wallet.currency
        }
    
    async def top_up(
        self,
        user_id: uuid.UUID,
        amount: Decimal,
        transaction_id: uuid.UUID,
        description: str = "Wallet top-up"
    ) -> WalletTransaction:
        """Add funds to wallet"""
        wallet = await self.get_or_create_wallet(user_id)
        
        # Check max balance
        new_balance = wallet.balance + amount
        if new_balance > settings.WALLET_MAX_BALANCE:
            raise ValueError(f"Wallet balance cannot exceed {settings.WALLET_MAX_BALANCE} XOF")
        
        # Update wallet
        wallet.balance = new_balance
        wallet.total_deposited += amount
        wallet.updated_at = datetime.utcnow()
        
        # Create wallet transaction
        wallet_tx = WalletTransaction(
            wallet_id=wallet.id,
            transaction_id=transaction_id,
            type="deposit",
            amount=amount,
            balance_after=new_balance,
            description=description
        )
        self.db.add(wallet_tx)
        await self.db.commit()
        
        logger.info("wallet_top_up",
                   user_id=str(user_id),
                   amount=float(amount),
                   new_balance=float(new_balance))
        
        return wallet_tx
    
    async def debit(
        self,
        user_id: uuid.UUID,
        amount: Decimal,
        transaction_id: Optional[uuid.UUID] = None,
        description: str = "Wallet payment",
        reserve_only: bool = False
    ) -> WalletTransaction:
        """Debit funds from wallet"""
        wallet = await self.get_or_create_wallet(user_id)
        
        available = wallet.balance - wallet.reserved_balance
        if amount > available:
            raise ValueError("Insufficient wallet balance")
        
        if reserve_only:
            # Just reserve, don't debit yet
            wallet.reserved_balance += amount
            tx_type = "reserve"
        else:
            # Actual debit
            wallet.balance -= amount
            tx_type = "payment"
        
        wallet.updated_at = datetime.utcnow()
        
        # Create wallet transaction
        wallet_tx = WalletTransaction(
            wallet_id=wallet.id,
            transaction_id=transaction_id,
            type=tx_type,
            amount=-amount,
            balance_after=wallet.balance,
            description=description
        )
        self.db.add(wallet_tx)
        await self.db.commit()
        
        logger.info("wallet_debit",
                   user_id=str(user_id),
                   amount=float(amount),
                   type=tx_type,
                   new_balance=float(wallet.balance))
        
        return wallet_tx
    
    async def credit(
        self,
        user_id: uuid.UUID,
        amount: Decimal,
        transaction_id: Optional[uuid.UUID] = None,
        description: str = "Wallet credit"
    ) -> WalletTransaction:
        """Credit funds to wallet (refund, payout, etc.)"""
        wallet = await self.get_or_create_wallet(user_id)
        
        new_balance = wallet.balance + amount
        wallet.balance = new_balance
        wallet.updated_at = datetime.utcnow()
        
        # Create wallet transaction
        wallet_tx = WalletTransaction(
            wallet_id=wallet.id,
            transaction_id=transaction_id,
            type="credit",
            amount=amount,
            balance_after=new_balance,
            description=description
        )
        self.db.add(wallet_tx)
        await self.db.commit()
        
        logger.info("wallet_credit",
                   user_id=str(user_id),
                   amount=float(amount),
                   new_balance=float(new_balance))
        
        return wallet_tx
    
    async def transfer(
        self,
        sender_id: uuid.UUID,
        recipient_id: uuid.UUID,
        amount: Decimal,
        note: Optional[str] = None
    ) -> dict:
        """Transfer funds between wallets"""
        if sender_id == recipient_id:
            raise ValueError("Cannot transfer to yourself")
        
        if amount > 500000:  # Max 500K XOF per transfer
            raise ValueError("Transfer amount exceeds limit")
        
        sender_wallet = await self.get_or_create_wallet(sender_id)
        recipient_wallet = await self.get_or_create_wallet(recipient_id)
        
        available = sender_wallet.balance - sender_wallet.reserved_balance
        if amount > available:
            raise ValueError("Insufficient wallet balance")
        
        # Debit sender
        sender_wallet.balance -= amount
        sender_wallet.updated_at = datetime.utcnow()
        
        sender_tx = WalletTransaction(
            wallet_id=sender_wallet.id,
            type="transfer_out",
            amount=-amount,
            balance_after=sender_wallet.balance,
            description=f"Transfer to user {str(recipient_id)[:8]}... - {note or 'No note'}"
        )
        self.db.add(sender_tx)
        
        # Credit recipient
        recipient_wallet.balance += amount
        recipient_wallet.updated_at = datetime.utcnow()
        
        recipient_tx = WalletTransaction(
            wallet_id=recipient_wallet.id,
            type="transfer_in",
            amount=amount,
            balance_after=recipient_wallet.balance,
            description=f"Transfer from user {str(sender_id)[:8]}... - {note or 'No note'}"
        )
        self.db.add(recipient_tx)
        
        await self.db.commit()
        
        logger.info("wallet_transfer",
                   sender_id=str(sender_id),
                   recipient_id=str(recipient_id),
                   amount=float(amount))
        
        return {
            "sender_transaction_id": str(sender_tx.id),
            "recipient_transaction_id": str(recipient_tx.id),
            "amount": float(amount),
            "sender_new_balance": float(sender_wallet.balance),
            "status": "completed"
        }
    
    async def release_reserved(
        self,
        user_id: uuid.UUID,
        amount: Decimal
    ) -> None:
        """Release reserved funds (cancel pending transaction)"""
        wallet = await self.get_or_create_wallet(user_id)
        
        if amount > wallet.reserved_balance:
            amount = wallet.reserved_balance
        
        wallet.reserved_balance -= amount
        wallet.updated_at = datetime.utcnow()
        await self.db.commit()
        
        logger.info("wallet_reserve_released",
                   user_id=str(user_id),
                   amount=float(amount))
    
    async def get_transactions(
        self,
        user_id: uuid.UUID,
        limit: int = 50,
        offset: int = 0,
        type: Optional[str] = None
    ) -> List[WalletTransaction]:
        """Get wallet transaction history"""
        wallet = await self.get_or_create_wallet(user_id)
        
        query = select(WalletTransaction).where(
            WalletTransaction.wallet_id == wallet.id
        )
        
        if type:
            query = query.where(WalletTransaction.type == type)
        
        query = query.order_by(
            WalletTransaction.created_at.desc()
        ).limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def withdraw(
        self,
        user_id: uuid.UUID,
        amount: Decimal,
        bank_account_id: uuid.UUID
    ) -> dict:
        """Initiate withdrawal to bank account"""
        wallet = await self.get_or_create_wallet(user_id)
        
        if amount < settings.MIN_PAYOUT_AMOUNT:
            raise ValueError(f"Minimum withdrawal is {settings.MIN_PAYOUT_AMOUNT} XOF")
        
        available = wallet.balance - wallet.reserved_balance
        if amount > available:
            raise ValueError("Insufficient wallet balance")
        
        # Create withdrawal transaction record
        transaction = Transaction(
            user_id=user_id,
            type="withdrawal",
            status="pending",
            amount=amount,
            currency=wallet.currency,
            provider="bank_transfer",
            metadata={"bank_account_id": str(bank_account_id)}
        )
        self.db.add(transaction)
        
        # Debit wallet
        wallet.balance -= amount
        wallet.total_withdrawn += amount
        wallet.updated_at = datetime.utcnow()
        
        wallet_tx = WalletTransaction(
            wallet_id=wallet.id,
            transaction_id=transaction.id,
            type="withdrawal",
            amount=-amount,
            balance_after=wallet.balance,
            description="Bank withdrawal (pending)"
        )
        self.db.add(wallet_tx)
        
        await self.db.commit()
        
        logger.info("wallet_withdrawal_initiated",
                   user_id=str(user_id),
                   amount=float(amount),
                   transaction_id=str(transaction.id))
        
        return {
            "transaction_id": str(transaction.id),
            "amount": float(amount),
            "status": "pending",
            "estimated_arrival": "2-3 business days"
        }
