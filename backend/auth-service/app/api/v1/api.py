from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.endpoints import auth, mfa, oidc, oauth, social

api_router = APIRouter()

api_router.include_router(auth.router, tags=["auth"])
api_router.include_router(mfa.router, tags=["mfa"])
api_router.include_router(social.router, tags=["social"])
api_router.include_router(oauth.router, tags=["oauth2"])
api_router.include_router(oidc.router, tags=["oidc"])

