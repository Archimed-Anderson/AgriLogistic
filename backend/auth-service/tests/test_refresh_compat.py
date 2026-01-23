import pytest


@pytest.mark.asyncio(scope="session")
async def test_refresh_endpoint_rotates(require_env):
    from httpx import AsyncClient

    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        # Create user
        reg = await ac.post(
            "/api/v1/auth/register",
            json={"email": "refresh@example.com", "password": "SecurePass123!", "full_name": "Refresh User"},
        )
        assert reg.status_code == 200
        token = reg.json()["verification_token"]
        ver = await ac.get(f"/api/v1/auth/verify-email/{token}")
        assert ver.status_code == 200

        # Login -> get refresh token
        login = await ac.post("/api/v1/auth/login", json={"email": "refresh@example.com", "password": "SecurePass123!"})
        assert login.status_code == 200
        refresh = login.json()["refresh_token"]

        # Refresh
        r1 = await ac.post("/api/v1/auth/refresh", json={"refresh_token": refresh})
        assert r1.status_code == 200
        body = r1.json()
        assert body["access_token"]
        new_refresh = body["refresh_token"]
        assert new_refresh and new_refresh != refresh

        # Old refresh must be invalid now
        r2 = await ac.post("/api/v1/auth/refresh", json={"refresh_token": refresh})
        assert r2.status_code == 400

