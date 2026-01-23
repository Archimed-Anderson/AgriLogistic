from __future__ import annotations

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=None,
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=False,
    )

    database_url: str = Field(validation_alias="DATABASE_URL")
    redis_url: str = Field(validation_alias="REDIS_URL")

    oidc_issuer: str = Field(default="http://localhost:8000", validation_alias="OIDC_ISSUER")

    jwt_algorithm: str = Field(default="RS256", validation_alias="JWT_ALGORITHM")
    jwt_kid: str = Field(default="web-app-jwt-key", validation_alias="JWT_KID")
    jwt_private_key_path: str = Field(default="/keys/jwt-private.pem", validation_alias="JWT_PRIVATE_KEY_PATH")
    jwt_public_key_path: str = Field(default="/keys/jwt-public.pem", validation_alias="JWT_PUBLIC_KEY_PATH")

    access_token_expire_seconds: int = Field(default=900, validation_alias="ACCESS_TOKEN_EXPIRE_SECONDS")
    refresh_token_expire_seconds: int = Field(default=604800, validation_alias="REFRESH_TOKEN_EXPIRE_SECONDS")

    oauth_session_secret: str = Field(default="change_me", validation_alias="OAUTH_SESSION_SECRET")

    max_login_attempts: int = Field(default=5, validation_alias="MAX_LOGIN_ATTEMPTS")
    lockout_duration_minutes: int = Field(default=30, validation_alias="LOCKOUT_DURATION_MINUTES")
    login_rate_limit_max: int = Field(default=5, validation_alias="LOGIN_RATE_LIMIT_MAX")
    login_rate_limit_window_seconds: int = Field(default=900, validation_alias="LOGIN_RATE_LIMIT_WINDOW_SECONDS")

    first_party_client_id: str = Field(default="agrologistic-web-app", validation_alias="FIRST_PARTY_CLIENT_ID")
    first_party_client_secret: str = Field(default="change_me", validation_alias="FIRST_PARTY_CLIENT_SECRET")
    first_party_client_name: str = Field(default="AgroLogistic Web App", validation_alias="FIRST_PARTY_CLIENT_NAME")
    first_party_redirect_uris: str = Field(
        default="http://localhost:3000/api/auth/callback",
        validation_alias="FIRST_PARTY_REDIRECT_URIS",
        description="Comma-separated redirect URIs",
    )

    google_client_id: str = Field(default="", validation_alias="GOOGLE_CLIENT_ID")
    google_client_secret: str = Field(default="", validation_alias="GOOGLE_CLIENT_SECRET")
    github_client_id: str = Field(default="", validation_alias="GITHUB_CLIENT_ID")
    github_client_secret: str = Field(default="", validation_alias="GITHUB_CLIENT_SECRET")


settings = Settings()

