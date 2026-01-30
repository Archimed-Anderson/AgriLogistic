"""Affiliation Service - Core business logic"""
from decimal import Decimal
from typing import Optional, List
from datetime import datetime, timedelta
import uuid
import hashlib
import secrets
import structlog

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models import Affiliate, AffiliateLink, Click, Referral, Commission, Payout
from app.core.config import settings

logger = structlog.get_logger()


class AffiliationService:
    """Core affiliation and referral tracking service"""
    
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create_affiliate(self, user_id: uuid.UUID, referral_code: str = None) -> Affiliate:
        """Create new affiliate profile"""
        if not referral_code:
            referral_code = self._generate_referral_code()
        
        affiliate = Affiliate(
            user_id=user_id,
            referral_code=referral_code,
            tier="bronze",
            commission_rate=Decimal(str(settings.DEFAULT_COMMISSION_RATE))
        )
        self.db.add(affiliate)
        await self.db.commit()
        await self.db.refresh(affiliate)
        
        logger.info("affiliate_created", affiliate_id=str(affiliate.id), user_id=str(user_id))
        return affiliate
    
    async def get_affiliate(self, affiliate_id: uuid.UUID) -> Optional[Affiliate]:
        """Get affiliate by ID"""
        return await self.db.get(Affiliate, affiliate_id)
    
    async def get_affiliate_by_user(self, user_id: uuid.UUID) -> Optional[Affiliate]:
        """Get affiliate by user ID"""
        result = await self.db.execute(
            select(Affiliate).where(Affiliate.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_affiliate_by_code(self, referral_code: str) -> Optional[Affiliate]:
        """Get affiliate by referral code"""
        result = await self.db.execute(
            select(Affiliate).where(Affiliate.referral_code == referral_code)
        )
        return result.scalar_one_or_none()
    
    async def create_link(
        self,
        affiliate_id: uuid.UUID,
        target_url: str,
        campaign: str = None,
        product_id: uuid.UUID = None,
        category: str = None
    ) -> AffiliateLink:
        """Create trackable affiliate link"""
        short_code = self._generate_short_code()
        
        link = AffiliateLink(
            affiliate_id=affiliate_id,
            short_code=short_code,
            target_url=target_url,
            campaign=campaign,
            product_id=product_id,
            category=category
        )
        self.db.add(link)
        await self.db.commit()
        await self.db.refresh(link)
        
        logger.info("affiliate_link_created", link_id=str(link.id), short_code=short_code)
        return link
    
    async def track_click(
        self,
        short_code: str,
        visitor_id: str = None,
        ip_address: str = None,
        user_agent: str = None,
        referer: str = None
    ) -> Optional[AffiliateLink]:
        """Track click on affiliate link"""
        result = await self.db.execute(
            select(AffiliateLink).where(AffiliateLink.short_code == short_code)
        )
        link = result.scalar_one_or_none()
        
        if not link:
            return None
        
        # Hash IP for privacy
        ip_hash = hashlib.sha256(ip_address.encode()).hexdigest()[:32] if ip_address else None
        
        # Create click record
        click = Click(
            link_id=link.id,
            visitor_id=visitor_id,
            ip_hash=ip_hash,
            user_agent=user_agent,
            referer=referer
        )
        self.db.add(click)
        
        # Update link stats
        link.total_clicks += 1
        
        # Check if unique (simplified)
        if visitor_id:
            existing = await self.db.execute(
                select(Click).where(
                    Click.link_id == link.id,
                    Click.visitor_id == visitor_id
                ).limit(1)
            )
            if not existing.scalar_one_or_none():
                link.unique_clicks += 1
        
        await self.db.commit()
        
        logger.info("click_tracked", link_id=str(link.id), short_code=short_code)
        return link
    
    async def track_conversion(
        self,
        order_id: uuid.UUID,
        order_amount: Decimal,
        referred_user_id: uuid.UUID
    ) -> Optional[Commission]:
        """Track conversion and calculate commission"""
        # Find referral
        result = await self.db.execute(
            select(Referral).where(Referral.referred_user_id == referred_user_id)
        )
        referral = result.scalar_one_or_none()
        
        if not referral:
            return None
        
        affiliate = await self.db.get(Affiliate, referral.affiliate_id)
        if not affiliate or not affiliate.is_active:
            return None
        
        # Calculate commission
        commission_amount = order_amount * (affiliate.commission_rate / Decimal("100"))
        
        commission = Commission(
            affiliate_id=affiliate.id,
            referral_id=referral.id,
            order_id=order_id,
            order_amount=order_amount,
            commission_rate=affiliate.commission_rate,
            commission_amount=commission_amount,
            status="pending"
        )
        self.db.add(commission)
        
        # Update affiliate stats
        affiliate.pending_earnings += commission_amount
        affiliate.total_earnings += commission_amount
        affiliate.total_conversions += 1
        
        # Update referral stats
        if not referral.first_purchase_at:
            referral.first_purchase_at = datetime.utcnow()
            referral.status = "converted"
        referral.total_purchases += order_amount
        
        await self.db.commit()
        
        logger.info("conversion_tracked",
                   affiliate_id=str(affiliate.id),
                   order_id=str(order_id),
                   commission=float(commission_amount))
        
        return commission
    
    async def register_referral(
        self,
        affiliate_id: uuid.UUID,
        referred_user_id: uuid.UUID,
        link_id: uuid.UUID = None
    ) -> Referral:
        """Register new referral"""
        referral = Referral(
            affiliate_id=affiliate_id,
            referred_user_id=referred_user_id,
            link_id=link_id,
            status="pending"
        )
        self.db.add(referral)
        
        # Update affiliate stats
        affiliate = await self.db.get(Affiliate, affiliate_id)
        if affiliate:
            affiliate.total_referrals += 1
        
        await self.db.commit()
        await self.db.refresh(referral)
        
        logger.info("referral_registered",
                   affiliate_id=str(affiliate_id),
                   referred_user_id=str(referred_user_id))
        
        return referral
    
    async def get_affiliate_stats(self, affiliate_id: uuid.UUID) -> dict:
        """Get affiliate statistics"""
        affiliate = await self.db.get(Affiliate, affiliate_id)
        if not affiliate:
            return None
        
        # Count links
        links_result = await self.db.execute(
            select(func.count(AffiliateLink.id)).where(
                AffiliateLink.affiliate_id == affiliate_id,
                AffiliateLink.is_active == True
            )
        )
        active_links = links_result.scalar()
        
        # Aggregate click stats
        clicks_result = await self.db.execute(
            select(
                func.sum(AffiliateLink.total_clicks),
                func.sum(AffiliateLink.unique_clicks)
            ).where(AffiliateLink.affiliate_id == affiliate_id)
        )
        total_clicks, unique_clicks = clicks_result.one()
        
        conversion_rate = 0
        if unique_clicks and unique_clicks > 0:
            conversion_rate = (affiliate.total_conversions / unique_clicks) * 100
        
        return {
            "total_clicks": total_clicks or 0,
            "unique_clicks": unique_clicks or 0,
            "conversions": affiliate.total_conversions,
            "conversion_rate": round(conversion_rate, 2),
            "total_earnings": float(affiliate.total_earnings),
            "pending_earnings": float(affiliate.pending_earnings),
            "paid_earnings": float(affiliate.paid_earnings),
            "total_referrals": affiliate.total_referrals,
            "active_links": active_links or 0
        }
    
    async def get_commissions(
        self,
        affiliate_id: uuid.UUID,
        status: str = None,
        limit: int = 50,
        offset: int = 0
    ) -> List[Commission]:
        """Get affiliate commissions"""
        query = select(Commission).where(Commission.affiliate_id == affiliate_id)
        
        if status:
            query = query.where(Commission.status == status)
        
        query = query.order_by(Commission.created_at.desc()).limit(limit).offset(offset)
        
        result = await self.db.execute(query)
        return result.scalars().all()
    
    async def request_payout(
        self,
        affiliate_id: uuid.UUID,
        amount: Decimal,
        payment_method: str,
        payment_details: dict
    ) -> Payout:
        """Request payout of commissions"""
        affiliate = await self.db.get(Affiliate, affiliate_id)
        
        if not affiliate:
            raise ValueError("Affiliate not found")
        
        if amount < settings.MIN_PAYOUT_AMOUNT:
            raise ValueError(f"Minimum payout amount is {settings.MIN_PAYOUT_AMOUNT} XOF")
        
        if amount > affiliate.pending_earnings:
            raise ValueError("Insufficient pending earnings")
        
        payout = Payout(
            affiliate_id=affiliate_id,
            amount=amount,
            payment_method=payment_method,
            payment_details=payment_details,
            status="pending"
        )
        self.db.add(payout)
        
        # Reserve the amount
        affiliate.pending_earnings -= amount
        
        await self.db.commit()
        await self.db.refresh(payout)
        
        logger.info("payout_requested",
                   affiliate_id=str(affiliate_id),
                   amount=float(amount))
        
        return payout
    
    def _generate_referral_code(self) -> str:
        """Generate unique referral code"""
        return secrets.token_urlsafe(6).upper()[:8]
    
    def _generate_short_code(self) -> str:
        """Generate short code for links"""
        return secrets.token_urlsafe(4)[:6]
