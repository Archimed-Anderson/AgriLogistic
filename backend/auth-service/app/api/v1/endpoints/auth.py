from __future__ import annotations

import datetime as dt
import secrets
from typing import Any
import uuid

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import delete, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.password import hash_password, verify_password
from app.core.security import create_access_token, decode_access_token
from app.db.session import get_db
from app.metrics import auth_login_attempts_total, auth_refresh_attempts_total
from app.models.oauth import OAuthClient, RefreshToken
from app.models.session import UserSession
from app.models.user import User
from app.models.user_tokens import EmailVerificationToken, PasswordResetToken
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    PasswordResetConfirmRequest,
    PasswordResetRequest,
    RefreshRequest,
    RegisterRequest,
    TokenResponse,
)
from app.services.redis_client import get_redis

router = APIRouter(prefix="/api/v1/auth")
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
    # Ensure the row exists before issuing refresh tokens (FK constraint).
    await db.flush()

async def _current_user_from_bearer(
    creds: HTTPAuthorizationCredentials | None,
    db: AsyncSession,
) -> User:
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


async def _rate_limit_login(redis, *, key: str) -> None:
    # Sliding-window-ish using INCR + EXPIRE. Good enough behind Kong RL.
    value = await redis.incr(key)
    if value == 1:
        await redis.expire(key, settings.login_rate_limit_window_seconds)
    if value > settings.login_rate_limit_max:
        raise HTTPException(status_code=429, detail="Too many login attempts. Please retry later.")


@router.post("/register")
async def register(payload: RegisterRequest, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    existing = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        username=payload.username,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        email_verified=False,
    )
    db.add(user)
    await db.flush()  # ensure user.id

    token = secrets.token_urlsafe(32)
    db.add(
        EmailVerificationToken(
            token=token,
            user_id=user.id,
            expires_at=dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=24),
        )
    )
    await db.commit()

    # In prod we would send an email; for now return token for dev/testing.
    return {"user_id": str(user.id), "message": "Verification email sent", "verification_token": token}

@router.post("/resend-verification")
async def resend_verification(payload: PasswordResetRequest, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    # payload uses the same schema (email only)
    user = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    if not user:
        return {"message": "If the email exists, a verification link has been sent."}
    if user.email_verified:
        return {"message": "Email already verified."}

    token = secrets.token_urlsafe(32)
    db.add(
        EmailVerificationToken(
            token=token,
            user_id=user.id,
            expires_at=dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=24),
        )
    )
    await db.commit()
    return {"message": "Verification email sent", "verification_token": token}


@router.get("/verify-email/{token}")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    row = (await db.execute(select(EmailVerificationToken).where(EmailVerificationToken.token == token))).scalar_one_or_none()
    if not row:
        raise HTTPException(status_code=400, detail="Invalid token")
    if row.expires_at < dt.datetime.now(dt.timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")

    await db.execute(update(User).where(User.id == row.user_id).values(email_verified=True))
    # Delete token after use
    await db.delete(row)
    await db.commit()
    return {"verified": True}


@router.post("/login", response_model=TokenResponse)
async def login(payload: LoginRequest, request: Request, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    redis = get_redis()
    client_ip = request.client.host if request.client else "unknown"
    await _rate_limit_login(redis, key=f"rl:login:{client_ip}:{payload.email}")

    user = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    if not user or not user.password_hash:
        auth_login_attempts_total.labels(status="invalid").inc()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # Lockout checks
    now = dt.datetime.now(dt.timezone.utc)
    if user.locked_until and user.locked_until > now:
        auth_login_attempts_total.labels(status="locked").inc()
        raise HTTPException(status_code=403, detail="Account locked. Try again later.")

    if not verify_password(payload.password, user.password_hash):
        auth_login_attempts_total.labels(status="invalid").inc()
        failed = (user.failed_login_attempts or 0) + 1
        locked_until = None
        if failed >= settings.max_login_attempts:
            locked_until = now + dt.timedelta(minutes=settings.lockout_duration_minutes)
            failed = 0
        await db.execute(
            update(User)
            .where(User.id == user.id)
            .values(failed_login_attempts=failed, locked_until=locked_until)
        )
        await db.commit()
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")

    # Reset lockout counters and set last_login
    await db.execute(
        update(User)
        .where(User.id == user.id)
        .values(failed_login_attempts=0, locked_until=None, last_login=now)
    )

    # Issue JWT access token (legacy-friendly: sub=email)
    access_token, claims = create_access_token(
        sub=user.email,
        roles=["user"],
        scope="openid profile email",
    )

    # Create an opaque refresh token for first-party use (rotation handled via /oauth/token too).
    await _ensure_first_party_client(db)
    refresh = secrets.token_urlsafe(32)
    rt_exp = now + dt.timedelta(seconds=settings.refresh_token_expire_seconds)
    db.add(
        RefreshToken(
            token=refresh,
            access_token_jti=claims.jti,
            client_id=settings.first_party_client_id,
            user_id=user.id,
            scope="openid profile email",
            expires_at=rt_exp,
        )
    )

    # Create a session record for device tracking (used later for UI sessions)
    session_token = secrets.token_urlsafe(32)
    db.add(
        UserSession(
            user_id=user.id,
            session_token=session_token,
            device_info={"ip": client_ip, "ua": request.headers.get("user-agent")},
            expires_at=now + dt.timedelta(days=30),
        )
    )

    await db.commit()

    auth_login_attempts_total.labels(status="success").inc()
    return TokenResponse(access_token=access_token, refresh_token=refresh, expires_in=settings.access_token_expire_seconds)

@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(payload: RefreshRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    """
    Backward compatible refresh endpoint.
    Wraps OAuth2 refresh semantics: rotate refresh token, return new access token.
    """
    now = dt.datetime.now(dt.timezone.utc)
    rt = (
        await db.execute(
            select(RefreshToken).where(
                RefreshToken.token == payload.refresh_token,
                RefreshToken.client_id == settings.first_party_client_id,
            )
        )
    ).scalar_one_or_none()

    if not rt:
        auth_refresh_attempts_total.labels(status="invalid").inc()
        raise HTTPException(status_code=400, detail="Invalid refresh_token")
    if rt.revoked:
        auth_refresh_attempts_total.labels(status="revoked").inc()
        raise HTTPException(status_code=400, detail="Refresh token revoked")
    if rt.expires_at < now:
        auth_refresh_attempts_total.labels(status="expired").inc()
        raise HTTPException(status_code=400, detail="Refresh token expired")
    if not rt.user_id:
        auth_refresh_attempts_total.labels(status="invalid").inc()
        raise HTTPException(status_code=400, detail="Refresh token missing user binding")

    user = (await db.execute(select(User).where(User.id == rt.user_id))).scalar_one_or_none()
    if not user:
        auth_refresh_attempts_total.labels(status="invalid").inc()
        raise HTTPException(status_code=400, detail="Unknown user")

    # Rotate: revoke old refresh, create new refresh
    await db.execute(update(RefreshToken).where(RefreshToken.token == payload.refresh_token).values(revoked=True))

    access_token, claims = create_access_token(
        sub=user.email,
        roles=["user"],
        scope=rt.scope or "openid profile email",
    )
    new_refresh = secrets.token_urlsafe(32)
    db.add(
        RefreshToken(
            token=new_refresh,
            access_token_jti=claims.jti,
            client_id=settings.first_party_client_id,
            user_id=user.id,
            scope=rt.scope,
            expires_at=now + dt.timedelta(seconds=settings.refresh_token_expire_seconds),
        )
    )
    await db.commit()

    auth_refresh_attempts_total.labels(status="success").inc()
    return TokenResponse(access_token=access_token, refresh_token=new_refresh, expires_in=settings.access_token_expire_seconds)


@router.post("/logout")
async def logout(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
):
    if not creds or not creds.credentials:
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    payload = decode_access_token(creds.credentials)
    jti = payload.get("jti")
    exp = payload.get("exp")
    if not jti or not exp:
        return {"logged_out": True}
    ttl = max(0, int(exp) - int(dt.datetime.now(dt.timezone.utc).timestamp()))
    redis = get_redis()
    await redis.setex(f"bl:jti:{jti}", ttl, "1")
    return {"logged_out": True}

@router.post("/logout-all")
async def logout_all(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user_from_bearer(creds, db)
    # Delete sessions
    await db.execute(delete(UserSession).where(UserSession.user_id == user.id))
    await db.commit()
    # Also revoke current access token
    if creds and creds.credentials:
        payload = decode_access_token(creds.credentials)
        jti = payload.get("jti")
        exp = payload.get("exp")
        if jti and exp:
            ttl = max(0, int(exp) - int(dt.datetime.now(dt.timezone.utc).timestamp()))
            redis = get_redis()
            await redis.setex(f"bl:jti:{jti}", ttl, "1")
    return {"logged_out_all": True}

@router.get("/me")
async def me(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user_from_bearer(creds, db)
    return {
        "id": str(user.id),
        "email": user.email,
        "username": user.username,
        "full_name": user.full_name,
        "email_verified": bool(user.email_verified),
        "mfa_enabled": bool(user.mfa_enabled),
    }

@router.get("/sessions")
async def list_sessions(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user_from_bearer(creds, db)
    rows = (await db.execute(select(UserSession).where(UserSession.user_id == user.id))).scalars().all()
    return {
        "sessions": [
            {
                "id": str(s.id),
                "expires_at": s.expires_at.isoformat(),
                "created_at": s.created_at.isoformat(),
                "last_active": s.last_active.isoformat(),
                "device_info": s.device_info,
            }
            for s in rows
        ]
    }

@router.delete("/sessions/{session_id}")
async def revoke_session(
    session_id: str,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user_from_bearer(creds, db)
    # Only delete sessions belonging to the user
    try:
        sid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session_id")
    await db.execute(delete(UserSession).where(UserSession.id == sid, UserSession.user_id == user.id))
    await db.commit()
    return {"revoked": True}


@router.post("/password-reset/request")
async def password_reset_request(payload: PasswordResetRequest, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    user = (await db.execute(select(User).where(User.email == payload.email))).scalar_one_or_none()
    # Always return 200 to prevent user enumeration
    if not user:
        return {"message": "If the email exists, a reset link has been sent."}

    token = secrets.token_urlsafe(32)
    db.add(
        PasswordResetToken(
            token=token,
            user_id=user.id,
            expires_at=dt.datetime.now(dt.timezone.utc) + dt.timedelta(hours=1),
            used=False,
        )
    )
    await db.commit()
    return {"message": "If the email exists, a reset link has been sent.", "reset_token": token}


@router.post("/password-reset/confirm")
async def password_reset_confirm(payload: PasswordResetConfirmRequest, db: AsyncSession = Depends(get_db)) -> dict[str, Any]:
    row = (await db.execute(select(PasswordResetToken).where(PasswordResetToken.token == payload.token))).scalar_one_or_none()
    if not row or row.used:
        raise HTTPException(status_code=400, detail="Invalid token")
    if row.expires_at < dt.datetime.now(dt.timezone.utc):
        raise HTTPException(status_code=400, detail="Token expired")

    await db.execute(update(User).where(User.id == row.user_id).values(password_hash=hash_password(payload.new_password)))
    await db.execute(update(PasswordResetToken).where(PasswordResetToken.token == payload.token).values(used=True))
    await db.commit()
    return {"reset": True}


@router.post("/password/change")
async def change_password(
    payload: ChangePasswordRequest,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    user = await _current_user_from_bearer(creds, db)
    if not user.password_hash:
        raise HTTPException(status_code=400, detail="Password not set for this account")
    if not verify_password(payload.old_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid old password")
    await db.execute(update(User).where(User.id == user.id).values(password_hash=hash_password(payload.new_password)))
    await db.commit()
    return {"changed": True}

