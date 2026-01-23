from __future__ import annotations

import datetime as dt
from typing import Any

import secrets

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.password import verify_password
from app.core.config import settings
from app.core.security import create_access_token, decode_access_token
from app.db.session import get_db
from app.models.oauth import OAuthClient
from app.models.mfa import MFABackupCode
from app.models.oauth import RefreshToken
from app.models.session import UserSession
from app.models.user import User
from app.schemas.auth import TokenResponse
from app.schemas.mfa import MFADisableRequest, MFAEnableResponse, MFALoginRequest, MFAVerifySetupRequest
from app.metrics import auth_mfa_verifications_total
from app.services.mfa_service import MFAService
from app.services.redis_client import get_redis

router = APIRouter(prefix="/api/v1/auth/mfa")
bearer = HTTPBearer(auto_error=False)

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


async def _current_user(creds: HTTPAuthorizationCredentials | None, db: AsyncSession) -> User:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    payload = decode_access_token(creds.credentials)
    jti = payload.get("jti")
    if jti:
        redis = get_redis()
        if await redis.get(f"bl:jti:{jti}"):
            raise HTTPException(status_code=401, detail="Token revoked")
    email = payload.get("sub")
    if not email:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = (await db.execute(select(User).where(User.email == str(email)))).scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=401, detail="Unknown user")
    return user


@router.post("/enable", response_model=MFAEnableResponse)
async def enable_mfa(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> MFAEnableResponse:
    user = await _current_user(creds, db)

    secret = MFAService.generate_secret()
    uri = MFAService.totp_uri(user.email, secret)
    qr_code = MFAService.generate_qr_svg_data_uri(uri)
    backup_codes = MFAService.generate_backup_codes()

    # Replace existing backup codes
    await db.execute(delete(MFABackupCode).where(MFABackupCode.user_id == user.id))

    for code in backup_codes:
        db.add(MFABackupCode(user_id=user.id, code_hash=MFAService.hash_backup_code(code), used=False))

    await db.execute(update(User).where(User.id == user.id).values(mfa_secret=secret, mfa_enabled=False))
    await db.commit()

    return MFAEnableResponse(secret=secret, qr_code=qr_code, backup_codes=backup_codes)


@router.post("/verify-setup")
async def verify_setup(
    payload: MFAVerifySetupRequest,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user(creds, db)
    if not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not initialized")
    if not MFAService.verify_totp(user.mfa_secret, payload.code):
        auth_mfa_verifications_total.labels(result="invalid").inc()
        raise HTTPException(status_code=400, detail="Invalid code")
    await db.execute(update(User).where(User.id == user.id).values(mfa_enabled=True))
    await db.commit()
    auth_mfa_verifications_total.labels(result="success").inc()
    return {"mfa_enabled": True}


@router.post("/disable")
async def disable_mfa(
    payload: MFADisableRequest,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user(creds, db)
    if not user.mfa_secret:
        return {"mfa_enabled": False}
    if not MFAService.verify_totp(user.mfa_secret, payload.code):
        auth_mfa_verifications_total.labels(result="invalid").inc()
        raise HTTPException(status_code=400, detail="Invalid code")
    await db.execute(update(User).where(User.id == user.id).values(mfa_enabled=False, mfa_secret=None))
    await db.execute(delete(MFABackupCode).where(MFABackupCode.user_id == user.id))
    await db.commit()
    auth_mfa_verifications_total.labels(result="success").inc()
    return {"mfa_enabled": False}


@router.post("/login", response_model=TokenResponse)
async def login_with_mfa(
    payload: MFALoginRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    user = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    if not user or not user.password_hash:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    if not user.mfa_enabled or not user.mfa_secret:
        raise HTTPException(status_code=400, detail="MFA not enabled for this account")

    # Verify TOTP or backup code
    ok = MFAService.verify_totp(user.mfa_secret, payload.mfa_code)
    if not ok:
        # backup codes
        codes = (await db.execute(select(MFABackupCode).where(MFABackupCode.user_id == user.id, MFABackupCode.used == False))).scalars().all()  # noqa: E712
        for c in codes:
            if MFAService.verify_backup_code(payload.mfa_code, c.code_hash):
                ok = True
                await db.execute(update(MFABackupCode).where(MFABackupCode.id == c.id).values(used=True))
                break

    if not ok:
        auth_mfa_verifications_total.labels(result="invalid").inc()
        raise HTTPException(status_code=400, detail="Invalid MFA code")
    auth_mfa_verifications_total.labels(result="success").inc()

    # Issue tokens + session (same strategy as /api/v1/auth/login)
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

    session_token = secrets.token_urlsafe(32)
    db.add(
        UserSession(
            user_id=user.id,
            session_token=session_token,
            device_info={"ip": request.client.host if request.client else "unknown", "ua": request.headers.get("user-agent")},
            expires_at=now + dt.timedelta(days=30),
        )
    )
    await db.commit()

    return TokenResponse(access_token=access_token, refresh_token=refresh, expires_in=request.app.state.access_token_ttl)

