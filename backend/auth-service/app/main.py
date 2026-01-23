from __future__ import annotations

from contextlib import asynccontextmanager

from prometheus_client import CONTENT_TYPE_LATEST, generate_latest
from fastapi import FastAPI
from fastapi.responses import Response

from app.api.v1.api import api_router
from app.core.config import settings

from starlette.middleware.sessions import SessionMiddleware

# Required by Authlib OAuth client flows (state, csrf protection)
async def bootstrap_first_party_client() -> None:
    # Ensure the first-party OAuth client exists (required by FK constraints for refresh tokens).
    from sqlalchemy import select

    from app.db.session import SessionLocal
    from app.models.oauth import OAuthClient

    redirect_uris = [u.strip() for u in (settings.first_party_redirect_uris or "").split(",") if u.strip()]

    async with SessionLocal() as db:
        existing = (await db.execute(select(OAuthClient).where(OAuthClient.client_id == settings.first_party_client_id))).scalar_one_or_none()
        if existing:
            return

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
        await db.commit()

@asynccontextmanager
async def lifespan(app: FastAPI):
    await bootstrap_first_party_client()
    yield


app = FastAPI(title="AgroLogistic Auth Service", version="2.0.0", lifespan=lifespan)

# TTLs used by OAuth endpoints (kept on app.state for easy access).
app.state.access_token_ttl = int(settings.access_token_expire_seconds)
app.state.refresh_token_ttl = int(settings.refresh_token_expire_seconds)

# Required by Authlib OAuth client flows (state, csrf protection)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.oauth_session_secret,
    same_site="lax",
    https_only=False,
)


@app.get("/")
async def root():
    return {"service": "auth-service", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/metrics")
async def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


# API routers (OAuth2/OIDC live at root; auth routes will be added under /api/v1/auth)
app.include_router(api_router)
