import pytest


@pytest.mark.asyncio(scope="session")
async def test_openid_configuration(require_env):
    # Import after env is ensured.
    from httpx import AsyncClient

    from app.main import app

    async with AsyncClient(app=app, base_url="http://test") as ac:
        r = await ac.get("/.well-known/openid-configuration")
        assert r.status_code == 200
        data = r.json()
        assert "issuer" in data
        assert data["token_endpoint"].endswith("/oauth/token")
        assert data["jwks_uri"].endswith("/.well-known/jwks.json")

