from __future__ import annotations

import base64
import io
import secrets

import pyotp
import qrcode
import qrcode.image.svg

from app.core.password import hash_password, verify_password


class MFAService:
    @staticmethod
    def generate_secret() -> str:
        return pyotp.random_base32()

    @staticmethod
    def totp_uri(email: str, secret: str) -> str:
        return pyotp.totp.TOTP(secret).provisioning_uri(name=email, issuer_name="AgroLogistic")

    @staticmethod
    def generate_qr_svg_data_uri(totp_uri: str) -> str:
        img = qrcode.make(totp_uri, image_factory=qrcode.image.svg.SvgImage)
        buffer = io.BytesIO()
        img.save(buffer)
        b64 = base64.b64encode(buffer.getvalue()).decode("ascii")
        return f"data:image/svg+xml;base64,{b64}"

    @staticmethod
    def verify_totp(secret: str, code: str) -> bool:
        return pyotp.TOTP(secret).verify(code, valid_window=1)

    @staticmethod
    def generate_backup_codes(count: int = 10) -> list[str]:
        # 8 chars each, upper-case, easy to type
        return [secrets.token_hex(4).upper() for _ in range(count)]

    @staticmethod
    def hash_backup_code(code: str) -> str:
        return hash_password(code)

    @staticmethod
    def verify_backup_code(code: str, code_hash: str) -> bool:
        return verify_password(code, code_hash)

