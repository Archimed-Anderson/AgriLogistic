from __future__ import annotations

import base64
import hashlib
import json
import time
import uuid
from dataclasses import dataclass
from typing import Any

from jose import jwt
from jose.exceptions import JWTError

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa

from app.core.config import settings


def _read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()


def load_private_key_pem() -> str:
    return _read_text_file(settings.jwt_private_key_path).strip()


def load_public_key_pem() -> str:
    return _read_text_file(settings.jwt_public_key_path).strip()


def _b64url_uint(n: int) -> str:
    b = n.to_bytes((n.bit_length() + 7) // 8, "big")
    return base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")


def jwks() -> dict[str, Any]:
    pub_pem = load_public_key_pem().encode("utf-8")
    pub = serialization.load_pem_public_key(pub_pem)
    if not isinstance(pub, rsa.RSAPublicKey):
        raise RuntimeError("Only RSA public keys are supported for JWKS")
    numbers = pub.public_numbers()
    return {
        "keys": [
            {
                "kty": "RSA",
                "use": "sig",
                "alg": settings.jwt_algorithm,
                "kid": settings.jwt_kid,
                "n": _b64url_uint(numbers.n),
                "e": _b64url_uint(numbers.e),
            }
        ]
    }


@dataclass
class AccessTokenClaims:
    sub: str
    scope: str | None
    roles: list[str] | None
    client_id: str | None
    exp: int
    iat: int
    iss: str
    jti: str


def create_access_token(
    *,
    sub: str,
    scope: str | None = None,
    roles: list[str] | None = None,
    client_id: str | None = None,
    expires_in: int | None = None,
) -> tuple[str, AccessTokenClaims]:
    now = int(time.time())
    exp = now + int(expires_in or settings.access_token_expire_seconds)
    jti = uuid.uuid4().hex

    payload: dict[str, Any] = {
        "sub": sub,
        "iss": settings.oidc_issuer,
        "iat": now,
        "exp": exp,
        "jti": jti,
        # Kong compatibility: key_claim_name is `kid` in kong.yml
        "kid": settings.jwt_kid,
    }
    if scope:
        payload["scope"] = scope
    if roles:
        payload["roles"] = roles
    if client_id:
        payload["client_id"] = client_id

    token = jwt.encode(
        payload,
        load_private_key_pem(),
        algorithm=settings.jwt_algorithm,
        headers={"kid": settings.jwt_kid},
    )

    return token, AccessTokenClaims(
        sub=sub,
        scope=scope,
        roles=roles,
        client_id=client_id,
        exp=exp,
        iat=now,
        iss=settings.oidc_issuer,
        jti=jti,
    )


def decode_access_token(token: str) -> dict[str, Any]:
    try:
        return jwt.decode(token, load_public_key_pem(), algorithms=[settings.jwt_algorithm], options={"verify_aud": False})
    except JWTError as e:
        raise e


def pkce_challenge(code_verifier: str, method: str) -> str:
    method = (method or "").upper()
    if method == "S256":
        digest = hashlib.sha256(code_verifier.encode("ascii")).digest()
        return base64.urlsafe_b64encode(digest).rstrip(b"=").decode("ascii")
    if method in ("PLAIN", ""):
        return code_verifier
    raise ValueError("Unsupported code_challenge_method")


def safe_json(data: Any) -> str:
    return json.dumps(data, separators=(",", ":"), ensure_ascii=False)

