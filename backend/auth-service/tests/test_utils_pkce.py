import pytest

from app.core.security import pkce_challenge


def test_pkce_s256():
    verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk"
    # RFC 7636 example output (base64url without padding)
    expected = "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM"
    assert pkce_challenge(verifier, "S256") == expected


def test_pkce_plain():
    verifier = "plain-verifier"
    assert pkce_challenge(verifier, "plain") == verifier


def test_pkce_invalid_method():
    with pytest.raises(ValueError):
        pkce_challenge("x", "S512")

