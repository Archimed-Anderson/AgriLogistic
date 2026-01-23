# Payment Service - AgroLogistic

Multi-provider payment system with Stripe, PayPal, Wallet, Escrow, and Marketplace Split Payments.

## Features

- **Multi-Provider Support**: Stripe, PayPal, Mobile Money (Flutterwave)
- **Marketplace Split Payments**: Automatic fee calculation and seller payouts
- **Escrow System**: Secure funds holding with auto-release
- **Virtual Wallet**: Top-up, withdraw, peer-to-peer transfers
- **Subscriptions**: Stripe/PayPal recurring billing
- **Webhooks**: Event-driven processing with retry logic

## Quick Start

```bash
# Start with Docker
docker-compose up -d

# Or run locally
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 5010
```

## API Endpoints

### Stripe Payments
- `POST /api/v1/payments/stripe/intent` - Create payment intent
- `POST /api/v1/payments/stripe/marketplace` - Split payment with escrow
- `POST /api/v1/payments/stripe/{id}/capture` - Capture payment
- `POST /api/v1/payments/stripe/{id}/refund` - Create refund

### PayPal
- `POST /api/v1/payments/paypal/create-order` - Create order
- `POST /api/v1/payments/paypal/capture/{id}` - Capture order

### Wallet
- `GET /api/v1/wallet` - Get balance
- `POST /api/v1/wallet/top-up` - Add funds
- `POST /api/v1/wallet/withdraw` - Withdraw to bank
- `POST /api/v1/wallet/transfer` - P2P transfer

### Webhooks
- `POST /api/v1/webhooks/stripe` - Stripe events
- `POST /api/v1/webhooks/paypal` - PayPal events

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
PAYPAL_CLIENT_ID=xxx
PAYPAL_CLIENT_SECRET=xxx
DATABASE_URL=postgresql://user:pass@host/db
PLATFORM_FEE_PERCENT=10.0
```

## Architecture

```
payment-service/
├── app/
│   ├── core/           # Config, Stripe/PayPal clients
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   ├── api/v1/         # FastAPI endpoints
│   └── workers/        # Celery tasks
├── migrations/         # SQL migrations
└── tests/              # Test suite
```
