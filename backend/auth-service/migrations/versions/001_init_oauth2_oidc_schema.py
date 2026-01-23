"""init oauth2/oidc schema

Revision ID: 001_init_oauth2_oidc
Revises:
Create Date: 2026-01-20

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision = "001_init_oauth2_oidc"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # UUID helpers
    op.execute("CREATE EXTENSION IF NOT EXISTS pgcrypto;")

    # ---- users (new, since existing service is mock) ----
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("email", sa.String(length=320), nullable=False, unique=True),
        sa.Column("username", sa.String(length=64), nullable=True, unique=True),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("password_hash", sa.String(length=255), nullable=True),
        sa.Column("email_verified", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("mfa_enabled", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("mfa_secret", sa.String(length=64), nullable=True),
        sa.Column("failed_login_attempts", sa.Integer(), nullable=False, server_default=sa.text("0")),
        sa.Column("locked_until", sa.DateTime(timezone=True), nullable=True),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ---- oauth clients ----
    op.create_table(
        "oauth_clients",
        sa.Column("client_id", sa.String(length=255), primary_key=True),
        sa.Column("client_secret", sa.String(length=255), nullable=False),
        sa.Column("client_name", sa.String(length=255), nullable=False),
        sa.Column("redirect_uris", sa.ARRAY(sa.Text()), nullable=False, server_default=sa.text("'{}'::text[]")),
        sa.Column("grant_types", sa.ARRAY(sa.Text()), nullable=False, server_default=sa.text("ARRAY['authorization_code','refresh_token']::text[]")),
        sa.Column("response_types", sa.ARRAY(sa.Text()), nullable=False, server_default=sa.text("ARRAY['code']::text[]")),
        sa.Column("scope", sa.Text(), nullable=False, server_default=sa.text("'openid profile email'")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ---- authorization codes ----
    op.create_table(
        "authorization_codes",
        sa.Column("code", sa.String(length=255), primary_key=True),
        sa.Column("client_id", sa.String(length=255), sa.ForeignKey("oauth_clients.client_id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("redirect_uri", sa.Text(), nullable=False),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("code_challenge", sa.String(length=255), nullable=True),
        sa.Column("code_challenge_method", sa.String(length=10), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("idx_authorization_codes_user", "authorization_codes", ["user_id"])
    op.create_index("idx_authorization_codes_client", "authorization_codes", ["client_id"])

    # ---- refresh tokens ----
    op.create_table(
        "refresh_tokens",
        sa.Column("token", sa.String(length=255), primary_key=True),
        sa.Column("access_token_jti", sa.String(length=255), nullable=True),
        sa.Column("client_id", sa.String(length=255), sa.ForeignKey("oauth_clients.client_id", ondelete="CASCADE"), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=True),
        sa.Column("scope", sa.Text(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("idx_refresh_tokens_user", "refresh_tokens", ["user_id"])
    op.create_index("idx_refresh_tokens_client", "refresh_tokens", ["client_id"])

    # ---- social accounts ----
    op.create_table(
        "social_accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("provider", sa.String(length=50), nullable=False),
        sa.Column("provider_user_id", sa.String(length=255), nullable=False),
        sa.Column("access_token", sa.Text(), nullable=True),
        sa.Column("refresh_token", sa.Text(), nullable=True),
        sa.Column("token_expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.UniqueConstraint("provider", "provider_user_id", name="uq_social_provider_user"),
    )
    op.create_index("idx_social_accounts_user", "social_accounts", ["user_id"])

    # ---- mfa backup codes ----
    op.create_table(
        "mfa_backup_codes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("code_hash", sa.String(length=255), nullable=False),
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("idx_mfa_backup_codes_user", "mfa_backup_codes", ["user_id"])

    # ---- email verification tokens ----
    op.create_table(
        "email_verification_tokens",
        sa.Column("token", sa.String(length=255), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ---- password reset tokens ----
    op.create_table(
        "password_reset_tokens",
        sa.Column("token", sa.String(length=255), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )

    # ---- user sessions ----
    op.create_table(
        "user_sessions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, server_default=sa.text("gen_random_uuid()")),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("session_token", sa.String(length=255), nullable=False, unique=True),
        sa.Column("device_info", postgresql.JSONB(), nullable=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
        sa.Column("last_active", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("now()")),
    )
    op.create_index("idx_sessions_user", "user_sessions", ["user_id"])
    op.create_index("idx_sessions_token", "user_sessions", ["session_token"])


def downgrade() -> None:
    op.drop_index("idx_sessions_token", table_name="user_sessions")
    op.drop_index("idx_sessions_user", table_name="user_sessions")
    op.drop_table("user_sessions")

    op.drop_table("password_reset_tokens")
    op.drop_table("email_verification_tokens")

    op.drop_index("idx_mfa_backup_codes_user", table_name="mfa_backup_codes")
    op.drop_table("mfa_backup_codes")

    op.drop_index("idx_social_accounts_user", table_name="social_accounts")
    op.drop_table("social_accounts")

    op.drop_index("idx_refresh_tokens_client", table_name="refresh_tokens")
    op.drop_index("idx_refresh_tokens_user", table_name="refresh_tokens")
    op.drop_table("refresh_tokens")

    op.drop_index("idx_authorization_codes_client", table_name="authorization_codes")
    op.drop_index("idx_authorization_codes_user", table_name="authorization_codes")
    op.drop_table("authorization_codes")

    op.drop_table("oauth_clients")
    op.drop_table("users")

