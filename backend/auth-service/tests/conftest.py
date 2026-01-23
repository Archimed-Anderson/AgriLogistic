import os

import pytest


@pytest.fixture(scope="session")
def require_env():
    """Skip integration tests when auth env isn't configured."""
    if not os.getenv("DATABASE_URL") or not os.getenv("REDIS_URL"):
        pytest.skip("DATABASE_URL/REDIS_URL not set (run tests inside docker-compose.auth.yml)")
