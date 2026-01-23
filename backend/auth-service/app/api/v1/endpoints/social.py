from __future__ import annotations

import datetime as dt
import secrets
from typing import Any

from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import create_access_token
from app.db.session import get_db
from app.models.oauth import OAuthClient, RefreshToken
from app.models.social import SocialAccount
from app.models.user import User
from app.schemas.auth import TokenResponse

router = APIRouter(prefix="/api/v1/auth")

oauth = OAuth()

async def _ensure_first_party_client(db: AsyncSession) -> None:
    existing = (
        await db.execute(select(OAuthClient).where(OAuthClient.client_id == settings.first_party_client_id))
    ).scalar_one_or_none()
    if existing:
        return
    redirect_uris = [u.strip() for u in (settings.first_party_redirect_uris or "").split(",") if u.strip()]
    db.add(
        OAuthClient(
            client_id=settings.first_party_client_id,
            client_secret=settings.first_party_client_secret,
            client_name=settings.first_party_client_name,
            redirect_uris=redirect_uris,
            grant_types=["authorization_code", "refresh_token"],
            response_types=["code"],
            scope="openid profile email",
            is_active=True,
        )
    )
    await db.flush()

if settings.google_client_id and settings.google_client_secret:
    oauth.register(
        name="google",
        client_id=settings.google_client_id,
        client_secret=settings.google_client_secret,
        server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
        client_kwargs={"scope": "openid email profile"},
    )

if settings.github_client_id and settings.github_client_secret:
    oauth.register(
        name="github",
        client_id=settings.github_client_id,
        client_secret=settings.github_client_secret,
        authorize_url="https://github.com/login/oauth/authorize",
        access_token_url="https://github.com/login/oauth/access_token",
        api_base_url="https://api.github.com/",
        client_kwargs={"scope": "read:user user:email"},
    )


@router.get("/google")
async def google_login(request: Request):
    client = getattr(oauth, "google", None)
    if client is None:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")
    redirect_uri = request.url_for("google_callback")
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/google/callback", name="google_callback", response_model=TokenResponse)
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    client = getattr(oauth, "google", None)
    if client is None:
        raise HTTPException(status_code=501, detail="Google OAuth not configured")

    token = await client.authorize_access_token(request)
    userinfo = token.get("userinfo")
    if not userinfo:
        # Prefer ID token parsing if available
        try:
            userinfo = await client.parse_id_token(request, token)
        except Exception:
            userinfo = None
    if not userinfo:
        raise HTTPException(status_code=400, detail="Unable to fetch userinfo from Google")

    provider_user_id = str(userinfo.get("sub") or "")
    email = str(userinfo.get("email") or "")
    name = userinfo.get("name")
    email_verified = bool(userinfo.get("email_verified") or False)

    if not provider_user_id or not email:
        raise HTTPException(status_code=400, detail="Invalid Google userinfo")

    account = (
        await db.execute(
            select(SocialAccount).where(
                SocialAccount.provider == "google",
                SocialAccount.provider_user_id == provider_user_id,
            )
        )
    ).scalar_one_or_none()

    if account:
        user = (await db.execute(select(User).where(User.id == account.user_id))).scalar_one()
    else:
        user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if not user:
            user = User(email=email, full_name=name, email_verified=email_verified)
            db.add(user)
            await db.flush()

        account = SocialAccount(
            user_id=user.id,
            provider="google",
            provider_user_id=provider_user_id,
            access_token=token.get("access_token"),
            refresh_token=token.get("refresh_token"),
            token_expires_at=(dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=int(token.get("expires_in", 0)))) if token.get("expires_in") else None,
        )
        db.add(account)

    access_token, claims = create_access_token(sub=user.email, roles=["user"], scope="openid profile email")
    refresh = secrets.token_urlsafe(32)
    now = dt.datetime.now(dt.timezone.utc)
    await _ensure_first_party_client(db)
    db.add(
        RefreshToken(
            token=refresh,
            access_token_jti=claims.jti,
            client_id=settings.first_party_client_id,
            user_id=user.id,
            scope="openid profile email",
            expires_at=now + dt.timedelta(seconds=settings.refresh_token_expire_seconds),
        )
    )
    await db.commit()
    return TokenResponse(access_token=access_token, refresh_token=refresh, expires_in=request.app.state.access_token_ttl)


@router.get("/github")
async def github_login(request: Request):
    client = getattr(oauth, "github", None)
    if client is None:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")
    redirect_uri = request.url_for("github_callback")
    return await client.authorize_redirect(request, redirect_uri)


@router.get("/github/callback", name="github_callback", response_model=TokenResponse)
async def github_callback(request: Request, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    client = getattr(oauth, "github", None)
    if client is None:
        raise HTTPException(status_code=501, detail="GitHub OAuth not configured")

    token = await client.authorize_access_token(request)
    resp = await client.get("user", token=token)
    profile = resp.json()
    provider_user_id = str(profile.get("id") or "")

    # GitHub may not return primary email in profile; fetch emails
    email = profile.get("email")
    if not email:
        emails_resp = await client.get("user/emails", token=token)
        emails = emails_resp.json() if hasattr(emails_resp, "json") else []
        primary = next((e for e in emails if e.get("primary")), None)
        email = primary.get("email") if primary else (emails[0].get("email") if emails else None)

    if not provider_user_id or not email:
        raise HTTPException(status_code=400, detail="Unable to determine GitHub user email")

    name = profile.get("name") or profile.get("login")

    account = (
        await db.execute(
            select(SocialAccount).where(
                SocialAccount.provider == "github",
                SocialAccount.provider_user_id == provider_user_id,
            )
        )
    ).scalar_one_or_none()

    if account:
        user = (await db.execute(select(User).where(User.id == account.user_id))).scalar_one()
    else:
        user = (await db.execute(select(User).where(User.email == email))).scalar_one_or_none()
        if not user:
            user = User(email=email, full_name=name, email_verified=True)
            db.add(user)
            await db.flush()

        account = SocialAccount(
            user_id=user.id,
            provider="github",
            provider_user_id=provider_user_id,
            access_token=token.get("access_token"),
            refresh_token=token.get("refresh_token"),
        )
        db.add(account)

    access_token, claims = create_access_token(sub=user.email, roles=["user"], scope="openid profile email")
    refresh = secrets.token_urlsafe(32)
    now = dt.datetime.now(dt.timezone.utc)
    await _ensure_first_party_client(db)
    db.add(
        RefreshToken(
            token=refresh,
            access_token_jti=claims.jti,
            client_id=settings.first_party_client_id,
            user_id=user.id,
            scope="openid profile email",
            expires_at=now + dt.timedelta(seconds=settings.refresh_token_expire_seconds),
        )
    )
    await db.commit()
    return TokenResponse(access_token=access_token, refresh_token=refresh, expires_in=request.app.state.access_token_ttl)

