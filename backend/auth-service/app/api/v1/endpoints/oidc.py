from __future__ import annotations

import re
import uuid
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import decode_access_token, jwks
from app.db.session import get_db
from app.metrics import auth_token_validation_seconds
from app.models.user import User
from app.services.redis_client import get_redis

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


@router.get("/.well-known/openid-configuration")
async def openid_configuration() -> dict[str, Any]:
    issuer = settings.oidc_issuer.rstrip("/")
    return {
        "issuer": issuer,
        "authorization_endpoint": f"{issuer}/oauth/authorize",
        "token_endpoint": f"{issuer}/oauth/token",
        "jwks_uri": f"{issuer}/.well-known/jwks.json",
        "userinfo_endpoint": f"{issuer}/oauth/userinfo",
        "revocation_endpoint": f"{issuer}/oauth/revoke",
        "introspection_endpoint": f"{issuer}/oauth/introspect",
        "response_types_supported": ["code"],
        "grant_types_supported": ["authorization_code", "refresh_token", "client_credentials"],
        "code_challenge_methods_supported": ["S256", "plain"],
        "token_endpoint_auth_methods_supported": ["client_secret_basic", "client_secret_post"],
        "scopes_supported": ["openid", "profile", "email", "api.read", "api.write"],
        "subject_types_supported": ["public"],
        "id_token_signing_alg_values_supported": [settings.jwt_algorithm],
    }


@router.get("/.well-known/jwks.json")
async def jwks_endpoint() -> dict[str, Any]:
    return jwks()


@router.get("/oauth/userinfo")
async def userinfo(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    if not creds or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Bearer token")

    with auth_token_validation_seconds.time():
        payload = decode_access_token(creds.credentials)
    jti = payload.get("jti")
    if jti:
        redis = get_redis()
        if await redis.get(f"bl:jti:{jti}"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token (missing sub)")

    user: User | None = None
    # Support both UUID-sub and legacy username/email-sub
    if re.fullmatch(r"[0-9a-fA-F-]{36}", str(sub) or ""):
        try:
            user_id = uuid.UUID(str(sub))
            user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
        except ValueError:
            user = None
    if user is None:
        user = (await db.execute(select(User).where(User.email == str(sub)))).scalar_one_or_none()
    if user is None and hasattr(User, "username"):
        user = (await db.execute(select(User).where(User.username == str(sub)))).scalar_one_or_none()

    if not user:
        # Spec: if user is not found, token is effectively invalid for userinfo
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown user")

    return {
        "sub": str(user.id),
        "name": user.full_name,
        "email": user.email,
        "email_verified": bool(user.email_verified),
        "updated_at": int(user.updated_at.timestamp()) if user.updated_at else None,
    }

