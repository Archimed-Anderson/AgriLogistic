from __future__ import annotations

from prometheus_client import Counter, Histogram

# Auth
auth_login_attempts_total = Counter(
    "auth_login_attempts_total",
    "Total login attempts",
    ["status"],
)

auth_refresh_attempts_total = Counter(
    "auth_refresh_attempts_total",
    "Total refresh attempts",
    ["status"],
)

# OAuth2
auth_oauth_tokens_issued_total = Counter(
    "auth_oauth_tokens_issued_total",
    "OAuth tokens issued",
    ["grant_type"],
)

# MFA
auth_mfa_verifications_total = Counter(
    "auth_mfa_verifications_total",
    "MFA verifications",
    ["result"],
)

# Token validation (app-side; Kong validation has its own metrics)
auth_token_validation_seconds = Histogram(
    "auth_token_validation_seconds",
    "Time spent validating JWT tokens",
)

