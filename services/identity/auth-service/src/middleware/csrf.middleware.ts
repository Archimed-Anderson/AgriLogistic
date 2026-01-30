import type { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

/**
 * CSRF Protection Middleware
 * Implements Double Submit Cookie pattern (stateless, signed token).
 *
 * Notes:
 * - CSRF protection is only relevant when using cookies for auth.
 * - This module provides the token endpoint and middleware. Enforcement can be
 *   toggled via CSRF_ENFORCE=true.
 */

export interface CsrfRequest extends Request {
  csrfToken?: string;
}

const CSRF_COOKIE_NAME = 'csrf_token';
const CSRF_DEFAULT_TTL_SECONDS = 60 * 60; // 1h

function getCsrfSecret(): string {
  const envSecret =
    process.env.CSRF_SECRET ||
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_REFRESH_SECRET;
  if (envSecret && envSecret.length >= 32) return envSecret;
  // Dev fallback only. In production, set CSRF_SECRET explicitly.
  return crypto.randomBytes(32).toString('hex');
}

function base64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function hmacSign(secret: string, data: string): string {
  return base64url(crypto.createHmac('sha256', secret).update(data).digest());
}

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (!k) continue;
    out[k] = decodeURIComponent(rest.join('=') || '');
  }
  return out;
}

/**
 * Generate a signed CSRF token.
 * Token format: nonce.timestamp.signature
 */
export function generateCsrfToken(nowMs: number = Date.now()): string {
  const nonce = base64url(crypto.randomBytes(24));
  const ts = Math.floor(nowMs / 1000).toString();
  const payload = `${nonce}.${ts}`;
  const sig = hmacSign(getCsrfSecret(), payload);
  return `${payload}.${sig}`;
}

export function verifyCsrfToken(token: string, ttlSeconds: number = CSRF_DEFAULT_TTL_SECONDS): boolean {
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [nonce, tsStr, sig] = parts;
  if (!nonce || !tsStr || !sig) return false;
  const ts = Number(tsStr);
  if (!Number.isFinite(ts)) return false;
  const now = Math.floor(Date.now() / 1000);
  if (ts > now + 60) return false; // clock skew protection
  if (now - ts > ttlSeconds) return false;

  const payload = `${nonce}.${tsStr}`;
  const expected = hmacSign(getCsrfSecret(), payload);

  // timingSafeEqual requires same length buffers
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

/**
 * CSRF protection middleware (only enforced when CSRF_ENFORCE=true).
 *
 * Requires:
 * - Cookie csrf_token
 * - Header x-csrf-token
 * - Values must match and token must be valid (signature + TTL)
 */
export const csrfProtection = async (
  req: CsrfRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const enforce = (process.env.CSRF_ENFORCE || '').toLowerCase() === 'true';
    if (!enforce) {
      next();
      return;
    }

    // Skip CSRF for GET, HEAD, OPTIONS (safe methods)
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      next();
      return;
    }

    const tokenFromHeader = (req.headers['x-csrf-token'] as string | undefined) || undefined;
    const cookies = parseCookies(req.headers.cookie);
    const tokenFromCookie = cookies[CSRF_COOKIE_NAME];

    if (!tokenFromHeader || !tokenFromCookie) {
      res.status(403).json({
        success: false,
        error: 'CSRF token missing',
      });
      return;
    }

    if (tokenFromHeader !== tokenFromCookie) {
      res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      });
      return;
    }

    if (!verifyCsrfToken(tokenFromHeader)) {
      res.status(403).json({
        success: false,
        error: 'Invalid CSRF token',
      });
      return;
    }

    next();
  } catch (error) {
    console.error('CSRF validation error:', error);
    res.status(500).json({
      success: false,
      error: 'CSRF validation failed',
    });
  }
};

/**
 * Endpoint to get CSRF token
 * GET /api/v1/auth/csrf-token
 */
export const getCsrfTokenHandler = async (
  _req: CsrfRequest,
  res: Response
): Promise<void> => {
  try {
    const ttl = Number(process.env.CSRF_TTL_SECONDS || CSRF_DEFAULT_TTL_SECONDS);
    const token = generateCsrfToken();

    const isProd = (process.env.NODE_ENV || '').toLowerCase() === 'production';
    const cookieParts = [
      `${CSRF_COOKIE_NAME}=${encodeURIComponent(token)}`,
      'Path=/',
      'SameSite=Lax',
      `Max-Age=${Number.isFinite(ttl) ? ttl : CSRF_DEFAULT_TTL_SECONDS}`,
    ];
    if (isProd) cookieParts.push('Secure');

    res.setHeader('Set-Cookie', cookieParts.join('; '));
    res.status(200).json({ success: true, csrfToken: token, expiresIn: ttl });
  } catch (error) {
    console.error('Error generating CSRF token:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate CSRF token',
    });
  }
};

/**
 * Alias kept for compatibility.
 */
export const validateCsrfToken = csrfProtection;
