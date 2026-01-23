from app.services.mfa_service import MFAService


def test_mfa_totp_roundtrip():
    secret = MFAService.generate_secret()
    code = __import__("pyotp").TOTP(secret).now()
    assert MFAService.verify_totp(secret, code) is True


def test_mfa_backup_codes_unique():
    codes = MFAService.generate_backup_codes(10)
    assert len(codes) == 10
    assert len(set(codes)) == 10

