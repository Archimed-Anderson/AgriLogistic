# Cloudflare Worker - Mobile Money Webhook Handler
# Validates webhook signatures and forwards to backend API

export default {
  async fetch(request, env) {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get webhook signature from headers
      const signature = request.headers.get('X-Webhook-Signature');
      const timestamp = request.headers.get('X-Webhook-Timestamp');

      if (!signature || !timestamp) {
        return new Response('Missing signature or timestamp', { status: 401 });
      }

      // Clone request to read body multiple times
      const requestClone = request.clone();
      const body = await requestClone.text();

      // Validate signature
      const isValid = await validateSignature(
        body,
        signature,
        timestamp,
        env.WEBHOOK_SECRET
      );

      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response('Unauthorized', { status: 401 });
      }

      // Validate timestamp (prevent replay attacks)
      const now = Math.floor(Date.now() / 1000);
      const requestTime = parseInt(timestamp);
      const timeDiff = Math.abs(now - requestTime);

      // Reject requests older than 5 minutes
      if (timeDiff > 300) {
        console.error('Webhook timestamp too old:', timeDiff);
        return new Response('Request expired', { status: 401 });
      }

      // Parse webhook payload
      const payload = JSON.parse(body);

      // Log webhook event
      console.log('Valid webhook received:', {
        event: payload.event_type,
        transaction_id: payload.transaction_id,
        timestamp: timestamp,
      });

      // Forward to backend API
      const apiResponse = await fetch(`${env.API_URL}/webhooks/mobile-money`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Source': 'cloudflare-worker',
          'X-Original-Signature': signature,
        },
        body: body,
      });

      if (!apiResponse.ok) {
        console.error('Backend API error:', apiResponse.status);
        return new Response('Backend processing failed', { status: 502 });
      }

      return new Response('OK', { status: 200 });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return new Response('Internal server error', { status: 500 });
    }
  },
};

/**
 * Validate HMAC-SHA256 signature
 */
async function validateSignature(body, signature, timestamp, secret) {
  // Create message to sign (body + timestamp)
  const message = `${body}.${timestamp}`;

  // Encode message and secret
  const encoder = new TextEncoder();
  const messageData = encoder.encode(message);
  const secretData = encoder.encode(secret);

  // Import secret key
  const key = await crypto.subtle.importKey(
    'raw',
    secretData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  // Generate HMAC
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);

  // Convert to hex string
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  // Compare signatures (constant-time comparison)
  return signature === signatureHex;
}
