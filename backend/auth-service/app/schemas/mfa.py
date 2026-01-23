from __future__ import annotations

from pydantic import BaseModel


class MFAEnableResponse(BaseModel):
    secret: str
    qr_code: str
    backup_codes: list[str]


class MFAVerifySetupRequest(BaseModel):
    code: str


class MFADisableRequest(BaseModel):
    code: str


class MFALoginRequest(BaseModel):
    email: str
    password: str
    mfa_code: str

