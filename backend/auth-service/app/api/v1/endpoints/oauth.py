from __future__ import annotations

import base64
import datetime as dt
import secrets
from typing import Any

from fastapi import APIRouter, Depends, Form, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, decode_access_token, pkce_challenge
from app.db.session import get_db
from app.metrics import auth_oauth_tokens_issued_total, auth_token_validation_seconds
from app.models.oauth import AuthorizationCode, OAuthClient, RefreshToken
from app.models.user import User
from app.services.redis_client import get_redis

router = APIRouter()
bearer = HTTPBearer(auto_error=False)


def _parse_basic_auth(header: str | None) -> tuple[str, str] | None:
    if not header:
        return None
    if not header.lower().startswith("basic "):
        return None
    raw = header.split(" ", 1)[1].strip()
    try:
        decoded = base64.b64decode(raw).decode("utf-8")
    except Exception:
        return None
    if ":" not in decoded:
        return None
    client_id, client_secret = decoded.split(":", 1)
    return client_id, client_secret


async def _require_client(
    db: AsyncSession,
    *,
    request: Request,
    client_id: str | None,
    client_secret: str | None,
) -> OAuthClient:
    basic = _parse_basic_auth(request.headers.get("authorization"))
    if basic:
        client_id, client_secret = basic

    if not client_id or not client_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing client credentials")

    client = (await db.execute(select(OAuthClient).where(OAuthClient.client_id == client_id))).scalar_one_or_none()
    if not client or not client.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid client")
    # NOTE: for production store hashed secrets; for now compare plaintext
    if client.client_secret != client_secret:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid client secret")
    return client


@router.get("/oauth/authorize")
async def authorize(
    request: Request,
    response_type: str,
    client_id: str,
    redirect_uri: str,
    scope: str | None = None,
    state: str | None = None,
    code_challenge: str | None = None,
    code_challenge_method: str | None = "S256",
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: AsyncSession = Depends(get_db),
):
    # API-first: Next.js (or a trusted UI) calls this endpoint with a logged-in user token.
    if not creds or not creds.credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Bearer token for authorize")

    if response_type != "code":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported response_type")

    client = (await db.execute(select(OAuthClient).where(OAuthClient.client_id == client_id))).scalar_one_or_none()
    if not client or not client.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unknown client")
    if redirect_uri not in (client.redirect_uris or []):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid redirect_uri")

    # Resolve current user from access token (legacy compatible).
    with auth_token_validation_seconds.time():
        token_payload = decode_access_token(creds.credentials)
    jti = token_payload.get("jti")
    if jti:
        redis = get_redis()
        if await redis.get(f"bl:jti:{jti}"):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token revoked")
    sub = token_payload.get("sub")
    if not sub:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = (await db.execute(select(User).where(User.email == str(sub)))).scalar_one_or_none()
    if user is None:
        user = (await db.execute(select(User).where(User.username == str(sub)))).scalar_one_or_none()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unknown user")

    if code_challenge_method and code_challenge_method.upper() not in ("S256", "PLAIN"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported code_challenge_method")

    # For PKCE flows, code_challenge is expected.
    if not code_challenge:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing code_challenge")

    code = secrets.token_urlsafe(32)
    expires_at = dt.datetime.now(dt.timezone.utc) + dt.timedelta(minutes=5)
    db.add(
        AuthorizationCode(
            code=code,
            client_id=client.client_id,
            user_id=user.id,
            redirect_uri=redirect_uri,
            scope=scope,
            code_challenge=code_challenge,
            code_challenge_method=(code_challenge_method or "S256").upper(),
            expires_at=expires_at,
        )
    )
    await db.commit()

    sep = "&" if "?" in redirect_uri else "?"
    location = f"{redirect_uri}{sep}code={code}"
    if state is not None:
        location += f"&state={state}"
    return RedirectResponse(url=location, status_code=302)


@router.post("/oauth/token")
async def token(
    request: Request,
    grant_type: str = Form(...),
    # Authorization code
    code: str | None = Form(default=None),
    redirect_uri: str | None = Form(default=None),
    code_verifier: str | None = Form(default=None),
    # Refresh
    refresh_token: str | None = Form(default=None),
    # Client creds
    scope: str | None = Form(default=None),
    # Client auth (client_secret_post)
    client_id: str | None = Form(default=None),
    client_secret: str | None = Form(default=None),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    client = await _require_client(db, request=request, client_id=client_id, client_secret=client_secret)

    if grant_type == "authorization_code":
        if not code or not redirect_uri:
            raise HTTPException(status_code=400, detail="Missing code or redirect_uri")
        if not code_verifier:
            raise HTTPException(status_code=400, detail="Missing code_verifier")

        auth_code = (await db.execute(select(AuthorizationCode).where(AuthorizationCode.code == code))).scalar_one_or_none()
        if not auth_code:
            raise HTTPException(status_code=400, detail="Invalid authorization code")
        if auth_code.used:
            raise HTTPException(status_code=400, detail="Authorization code already used")
        if auth_code.client_id != client.client_id:
            raise HTTPException(status_code=400, detail="Authorization code client mismatch")
        if auth_code.redirect_uri != redirect_uri:
            raise HTTPException(status_code=400, detail="redirect_uri mismatch")
        if auth_code.expires_at < dt.datetime.now(dt.timezone.utc):
            raise HTTPException(status_code=400, detail="Authorization code expired")

        # PKCE verification
        expected = auth_code.code_challenge or ""
        method = (auth_code.code_challenge_method or "S256").upper()
        try:
            computed = pkce_challenge(code_verifier, method)
        except ValueError:
            raise HTTPException(status_code=400, detail="Unsupported code_challenge_method")
        if computed != expected:
            raise HTTPException(status_code=400, detail="Invalid code_verifier")

        user = (await db.execute(select(User).where(User.id == auth_code.user_id))).scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=400, detail="Unknown user")

        # Mark code used
        await db.execute(update(AuthorizationCode).where(AuthorizationCode.code == code).values(used=True))

        access_token, claims = create_access_token(
            sub=str(user.id),
            scope=auth_code.scope,
            roles=["user"],
            client_id=client.client_id,
        )
        new_refresh = secrets.token_urlsafe(32)
        rt_exp = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=int(request.app.state.refresh_token_ttl))
        db.add(
            RefreshToken(
                token=new_refresh,
                access_token_jti=claims.jti,
                client_id=client.client_id,
                user_id=user.id,
                scope=auth_code.scope,
                expires_at=rt_exp,
            )
        )
        await db.commit()

        auth_oauth_tokens_issued_total.labels(grant_type="authorization_code").inc()
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": request.app.state.access_token_ttl,
            "refresh_token": new_refresh,
            "scope": auth_code.scope,
        }

    if grant_type == "refresh_token":
        if not refresh_token:
            raise HTTPException(status_code=400, detail="Missing refresh_token")

        rt = (await db.execute(select(RefreshToken).where(RefreshToken.token == refresh_token))).scalar_one_or_none()
        if not rt or rt.client_id != client.client_id:
            raise HTTPException(status_code=400, detail="Invalid refresh_token")
        if rt.revoked:
            raise HTTPException(status_code=400, detail="Refresh token revoked")
        if rt.expires_at < dt.datetime.now(dt.timezone.utc):
            raise HTTPException(status_code=400, detail="Refresh token expired")

        # Rotate refresh token
        await db.execute(update(RefreshToken).where(RefreshToken.token == refresh_token).values(revoked=True))

        user_sub = str(rt.user_id) if rt.user_id else client.client_id
        access_token, claims = create_access_token(
            sub=user_sub,
            scope=rt.scope,
            roles=["user"] if rt.user_id else None,
            client_id=client.client_id,
        )
        new_refresh = secrets.token_urlsafe(32)
        rt_exp = dt.datetime.now(dt.timezone.utc) + dt.timedelta(seconds=int(request.app.state.refresh_token_ttl))
        db.add(
            RefreshToken(
                token=new_refresh,
                access_token_jti=claims.jti,
                client_id=client.client_id,
                user_id=rt.user_id,
                scope=rt.scope,
                expires_at=rt_exp,
            )
        )
        await db.commit()

        auth_oauth_tokens_issued_total.labels(grant_type="refresh_token").inc()
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": request.app.state.access_token_ttl,
            "refresh_token": new_refresh,
            "scope": rt.scope,
        }

    if grant_type == "client_credentials":
        # Scope is optional and depends on your client configuration policy.
        access_token, _claims = create_access_token(
            sub=client.client_id,
            scope=scope,
            roles=None,
            client_id=client.client_id,
        )
        await db.commit()
        auth_oauth_tokens_issued_total.labels(grant_type="client_credentials").inc()
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": request.app.state.access_token_ttl,
            "scope": scope,
        }

    raise HTTPException(status_code=400, detail="Unsupported grant_type")


@router.post("/oauth/revoke")
async def revoke(
    request: Request,
    token: str = Form(...),
    token_type_hint: str | None = Form(default=None),
    client_id: str | None = Form(default=None),
    client_secret: str | None = Form(default=None),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    client = await _require_client(db, request=request, client_id=client_id, client_secret=client_secret)

    # We revoke refresh tokens in DB. Access token blacklisting is handled in the next phase via Redis.
    rt = (await db.execute(select(RefreshToken).where(RefreshToken.token == token))).scalar_one_or_none()
    if rt and rt.client_id == client.client_id:
        await db.execute(update(RefreshToken).where(RefreshToken.token == token).values(revoked=True))
        await db.commit()
    return {"revoked": True}


@router.post("/oauth/introspect")
async def introspect(
    request: Request,
    token: str = Form(...),
    client_id: str | None = Form(default=None),
    client_secret: str | None = Form(default=None),
    db: AsyncSession = Depends(get_db),
) -> dict[str, Any]:
    _client = await _require_client(db, request=request, client_id=client_id, client_secret=client_secret)

    # JWT introspection (no Redis blacklist check here yet)
    try:
        with auth_token_validation_seconds.time():
            payload = decode_access_token(token)
    except Exception:
        return {"active": False}

    exp = payload.get("exp")
    if not exp:
        return {"active": False}

    jti = payload.get("jti")
    if jti:
        redis = get_redis()
        if await redis.get(f"bl:jti:{jti}"):
            return {"active": False}

    return {
        "active": True,
        "sub": payload.get("sub"),
        "scope": payload.get("scope"),
        "client_id": payload.get("client_id"),
        "exp": exp,
        "iat": payload.get("iat"),
        "iss": payload.get("iss"),
        "jti": payload.get("jti"),
    }

