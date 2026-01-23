/* eslint-disable no-console */

/**
 * Smoke test for Kong + OAuth2/OIDC auth-service routing.
 *
 * Flow:
 * - OIDC discovery + JWKS (public)
 * - Register -> verify email -> login -> me
 *
 * Usage:
 *   node scripts/smoke-auth-via-kong.mjs
 *
 * Optional:
 *   BASE_URL=http://localhost:8000 node scripts/smoke-auth-via-kong.mjs
 */

const baseUrl = process.env.BASE_URL || 'http://localhost:8000'
const apiBase = `${baseUrl}/api/v1/auth`

function fail(step, status, body) {
  console.error(`[FAIL] ${step}`)
  if (typeof status !== 'undefined') console.error(`status: ${status}`)
  if (typeof body !== 'undefined') console.error(`body: ${body}`)
  process.exit(1)
}

async function httpText(url, init) {
  const r = await fetch(url, init)
  const t = await r.text()
  return { r, t }
}

async function main() {
  const email = `smoke_${Date.now()}@example.com`
  const password = 'TestPass123!'
  const username = `smoke${Date.now()}`

  console.log(`[INFO] baseUrl=${baseUrl}`)

  // 1) OIDC discovery
  {
    const url = `${baseUrl}/.well-known/openid-configuration`
    const { r, t } = await httpText(url)
    console.log(`[CHECK] discovery ${r.status}`)
    if (!r.ok) fail('oidc discovery', r.status, t)
  }

  // 2) JWKS
  {
    const url = `${baseUrl}/.well-known/jwks.json`
    const { r, t } = await httpText(url)
    console.log(`[CHECK] jwks ${r.status}`)
    if (!r.ok) fail('jwks', r.status, t)
  }

  // 3) Register
  let verificationToken = ''
  {
    const url = `${apiBase}/register`
    const { r, t } = await httpText(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: 'Smoke Test', username }),
    })
    console.log(`[CHECK] register ${r.status} ${t}`)
    if (!r.ok) fail('register', r.status, t)
    const body = JSON.parse(t)
    verificationToken = body.verification_token || body.verificationToken || ''
    if (!verificationToken) fail('register missing verification_token', r.status, t)
  }

  // 4) Verify email
  {
    const url = `${apiBase}/verify-email/${encodeURIComponent(verificationToken)}`
    const { r, t } = await httpText(url)
    console.log(`[CHECK] verify-email ${r.status} ${t}`)
    if (!r.ok) fail('verify-email', r.status, t)
  }

  // 5) Login
  let accessToken = ''
  {
    const url = `${apiBase}/login`
    const { r, t } = await httpText(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    console.log(`[CHECK] login ${r.status} ${t}`)
    if (!r.ok) fail('login', r.status, t)
    const body = JSON.parse(t)
    accessToken = body.access_token || body.accessToken || body.token || ''
    if (!accessToken) fail('login missing access_token', r.status, t)
  }

  // 6) Me
  {
    const url = `${apiBase}/me`
    const { r, t } = await httpText(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    console.log(`[CHECK] me ${r.status} ${t}`)
    if (!r.ok) fail('me', r.status, t)
  }

  console.log('[PASS] smoke-auth-via-kong')
}

main().catch((e) => {
  console.error('[FAIL] unexpected error', e)
  process.exit(1)
})

