# Cloudflare Workers Deployment Guide

## Mobile Money Webhook Worker

This worker validates Mobile Money webhook signatures and forwards verified requests to the backend API.

### Features

- **HMAC-SHA256 Signature Validation**: Cryptographic verification of webhook authenticity
- **Replay Attack Prevention**: Timestamp validation (5-minute window)
- **Secure Forwarding**: Proxies verified webhooks to backend API
- **Error Handling**: Comprehensive logging and error responses

---

## Prerequisites

1. **Cloudflare Account** - [Sign up](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI** - Cloudflare Workers deployment tool

```bash
pnpm add -g wrangler
```

---

## Setup

### 1. Authenticate Wrangler

```bash
wrangler login
```

This will open a browser window to authenticate with Cloudflare.

### 2. Configure Environment Variables

Edit `infrastructure/cloudflare-workers/wrangler.json`:

```json
{
  "vars": {
    "API_URL": "https://agri-api.onrender.com",
    "WEBHOOK_SECRET": "your-webhook-secret-here"
  }
}
```

**Important**: The `WEBHOOK_SECRET` must match the secret configured in your Mobile Money provider dashboard.

### 3. Deploy Worker

```bash
cd infrastructure/cloudflare-workers
wrangler deploy mobile-money-webhook.js
```

### 4. Get Worker URL

After deployment, Wrangler will output the worker URL:

```
https://mobile-money-webhook.YOUR_SUBDOMAIN.workers.dev
```

### 5. Configure Mobile Money Provider

In your Mobile Money provider dashboard (e.g., MTN, Orange Money):

1. Set webhook URL to: `https://mobile-money-webhook.YOUR_SUBDOMAIN.workers.dev`
2. Configure signature algorithm: **HMAC-SHA256**
3. Set webhook secret (must match `WEBHOOK_SECRET` in wrangler.json)

---

## How It Works

### 1. Webhook Received

Mobile Money provider sends POST request with:
- **Headers**:
  - `X-Webhook-Signature`: HMAC-SHA256 signature
  - `X-Webhook-Timestamp`: Unix timestamp
- **Body**: JSON payload with transaction details

### 2. Signature Validation

Worker validates signature using:
```
message = body + "." + timestamp
signature = HMAC-SHA256(message, WEBHOOK_SECRET)
```

### 3. Timestamp Validation

Rejects requests older than 5 minutes to prevent replay attacks.

### 4. Forward to Backend

If valid, forwards to: `${API_URL}/webhooks/mobile-money`

---

## Testing

### Test with cURL

```bash
# Generate test signature (replace with your secret)
SECRET="your-webhook-secret-here"
TIMESTAMP=$(date +%s)
BODY='{"event_type":"payment.success","transaction_id":"TX123"}'
MESSAGE="${BODY}.${TIMESTAMP}"

# Generate HMAC-SHA256 signature
SIGNATURE=$(echo -n "$MESSAGE" | openssl dgst -sha256 -hmac "$SECRET" | awk '{print $2}')

# Send test webhook
curl -X POST https://mobile-money-webhook.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: $SIGNATURE" \
  -H "X-Webhook-Timestamp: $TIMESTAMP" \
  -d "$BODY"
```

Expected response: `OK` (status 200)

### Test Invalid Signature

```bash
curl -X POST https://mobile-money-webhook.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -H "X-Webhook-Signature: invalid-signature" \
  -H "X-Webhook-Timestamp: $(date +%s)" \
  -d '{"test": true}'
```

Expected response: `Unauthorized` (status 401)

---

## Monitoring

### View Logs

```bash
wrangler tail mobile-money-webhook
```

### Metrics

View worker metrics in Cloudflare Dashboard:
1. Go to **Workers & Pages**
2. Select `mobile-money-webhook`
3. Click **Metrics** tab

Metrics include:
- Request count
- Success rate
- Errors
- CPU time

---

## Security Best Practices

### ✅ DO

- **Rotate secrets** every 90 days
- **Use strong secrets** (32+ characters, random)
- **Monitor logs** for suspicious activity
- **Set up alerts** for high error rates

### ❌ DON'T

- **Don't commit secrets** to Git
- **Don't disable signature validation**
- **Don't increase timestamp window** beyond 5 minutes
- **Don't expose worker URL** publicly (only share with provider)

---

## Troubleshooting

### Worker Returns 401 (Unauthorized)

**Cause**: Signature validation failed

**Solutions**:
1. Verify `WEBHOOK_SECRET` matches provider configuration
2. Check signature algorithm is HMAC-SHA256
3. Ensure timestamp is current (not older than 5 minutes)

### Worker Returns 502 (Bad Gateway)

**Cause**: Backend API unreachable or returned error

**Solutions**:
1. Verify `API_URL` is correct
2. Check backend API is running: `curl https://agri-api.onrender.com/health`
3. Review backend logs for errors

### Worker Returns 500 (Internal Server Error)

**Cause**: Unexpected error in worker code

**Solutions**:
1. Check worker logs: `wrangler tail mobile-money-webhook`
2. Verify JSON payload is valid
3. Check for syntax errors in worker code

---

## Cost

Cloudflare Workers Free Tier:
- **100,000 requests/day**
- **10ms CPU time per request**
- **Unlimited bandwidth**

**Monthly Cost**: **$0** for typical webhook volumes

---

## Next Steps

- [ ] Deploy worker to Cloudflare
- [ ] Configure Mobile Money provider webhook URL
- [ ] Test with sample webhook
- [ ] Monitor logs for successful webhooks
- [ ] Set up alerts for errors
