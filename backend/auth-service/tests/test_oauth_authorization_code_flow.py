import secrets
import urllib.parse

import pytest
from sqlalchemy import delete, select


@pytest.mark.asyncio(scope="session")
async def test_authorization_code_pkce_flow(require_env):
    from httpx import AsyncClient

    from app.core.password import hash_password
    from app.core.security import pkce_challenge
    from app.db.session import SessionLocal
    from app.main import app
    from app.models.oauth import OAuthClient
    from app.models.user import User

    client_id = "test-client"
    client_secret = "test-secret"
    redirect_uri = "http://localhost/callback"

    # Seed DB
    async with SessionLocal() as db:
        await db.execute(delete(OAuthClient).where(OAuthClient.client_id == client_id))
        await db.execute(delete(User).where(User.email == "user@example.com"))
        user = User(email="user@example.com", full_name="User", password_hash=hash_password("SecurePass123!"), email_verified=True)
        db.add(user)
        db.add(
            OAuthClient(
                client_id=client_id,
                client_secret=client_secret,
                client_name="Test Client",
                redirect_uris=[redirect_uri],
                grant_types=["authorization_code", "refresh_token"],
                response_types=["code"],
                scope="openid profile email",
                is_active=True,
            )
        )
        await db.commit()

    verifier = secrets.token_urlsafe(32)
    challenge = pkce_challenge(verifier, "S256")

    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Login (first-party) to obtain a Bearer token used by /oauth/authorize (API-first)
        login = await ac.post("/api/v1/auth/login", json={"email": "user@example.com", "password": "SecurePass123!"})
        assert login.status_code == 200
        login_json = login.json()
        bearer = login_json["access_token"]

        # Authorize
        auth = await ac.get(
            "/oauth/authorize",
            params={
                "response_type": "code",
                "client_id": client_id,
                "redirect_uri": redirect_uri,
                "scope": "openid profile email",
                "state": "xyz",
                "code_challenge": challenge,
                "code_challenge_method": "S256",
            },
            headers={"Authorization": f"Bearer {bearer}"},
            follow_redirects=False,
        )
        assert auth.status_code in (302, 307)
        location = auth.headers["location"]
        parsed = urllib.parse.urlparse(location)
        qs = urllib.parse.parse_qs(parsed.query)
        code = qs["code"][0]

        # Exchange token
        tok = await ac.post(
            "/oauth/token",
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": redirect_uri,
                "client_id": client_id,
                "client_secret": client_secret,
                "code_verifier": verifier,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        assert tok.status_code == 200
        tok_json = tok.json()
        assert "access_token" in tok_json
        assert "refresh_token" in tok_json

        # UserInfo
        ui = await ac.get("/oauth/userinfo", headers={"Authorization": f"Bearer {tok_json['access_token']}"})
        assert ui.status_code == 200
        ui_json = ui.json()
        assert ui_json["email"] == "user@example.com"

