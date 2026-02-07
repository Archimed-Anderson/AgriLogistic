# Quick Deployment Guide

## 🚀 Deploy AgriLogistic to Production (30 minutes)

This guide walks you through deploying the entire AgriLogistic platform to production using free tiers.

---

## Prerequisites

- [x] GitHub account
- [ ] Neon account (create at [neon.tech](https://neon.tech))
- [ ] Cloudflare account (create at [cloudflare.com](https://cloudflare.com))
- [ ] Vercel account (create at [vercel.com](https://vercel.com))
- [ ] Render account (create at [render.com](https://render.com))

---

## Step 1: Database Setup (5 minutes)

### 1.1 Create Neon Database

1. Go to [https://console.neon.tech](https://console.neon.tech)
2. Click "Create Project"
3. Name: `agrilogistic-prod`
4. Region: **EU (Frankfurt)**
5. Click "Create Project"

### 1.2 Get Connection String

1. In Neon dashboard, click "Connection Details"
2. Select "Pooled connection" (recommended for serverless)
3. Copy the connection string
4. Save it for later (format: `postgresql://user:password@ep-name-123.eu-central-1.aws.neon.tech/agrilogistic?sslmode=require`)

### 1.3 Push Schema

```bash
# From project root
cd packages/database
DATABASE_URL="<your-neon-url>" npx prisma db push
```

✅ **Checkpoint**: Verify tables created in Neon dashboard → SQL Editor

---

## Step 2: Object Storage Setup (10 minutes)

### 2.1 Create R2 Buckets

1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **R2 Object Storage**
3. Create 5 buckets:
   - `agri-products` (public access enabled)
   - `agri-kyc` (private)
   - `agri-pods` (private)
   - `agri-diagnostics` (private)
   - `agri-contracts` (private)

### 2.2 Configure CORS

For each bucket, go to **Settings → CORS policy** and paste:

```json
[
  {
    "AllowedOrigins": ["https://agrilogistic.vercel.app", "https://*.vercel.app"],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "MaxAgeSeconds": 3600
  }
]
```

### 2.3 Get API Credentials

1. Go to **R2 → Manage R2 API Tokens**
2. Click "Create API token"
3. Name: `agrilogistic-prod`
4. Permissions: **Object Read & Write**
5. Copy:
   - Access Key ID
   - Secret Access Key
6. Copy your **Account ID** from R2 overview page

✅ **Checkpoint**: You should have 3 values saved (Account ID, Access Key, Secret Key)

---

## Step 3: Frontend Deployment (5 minutes)

### 3.1 Deploy to Vercel

```bash
# Install Vercel CLI
pnpm add -g vercel

# Navigate to web-app
cd apps/web-app

# Link and deploy
vercel link
vercel --prod
```

### 3.2 Configure Environment Variables

In **Vercel Dashboard → Project → Settings → Environment Variables**, add:

```bash
# Production environment
NEXT_PUBLIC_API_URL="https://agri-api.onrender.com/api/v1"
NEXT_PUBLIC_AI_SERVICE_URL="https://agri-ai.onrender.com"
DATABASE_URL="<your-neon-url>"
R2_ACCOUNT_ID="<your-account-id>"
R2_ACCESS_KEY_ID="<your-access-key>"
R2_SECRET_ACCESS_KEY="<your-secret-key>"
NEXT_PUBLIC_R2_URL="https://agri-products.<account-id>.r2.cloudflarestorage.com"
```

### 3.3 Update vercel.json

Replace `ACCOUNT_ID` in `apps/web-app/vercel.json` line 48:

```json
"destination": "https://agri-products.YOUR_ACCOUNT_ID.r2.cloudflarestorage.com/:path*"
```

### 3.4 Redeploy

```bash
vercel --prod
```

✅ **Checkpoint**: Visit your Vercel URL and verify the app loads

---

## Step 4: Backend Deployment (10 minutes)

### 4.1 Deploy to Render

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click "New +" → "Blueprint"
3. Connect your GitHub repository
4. Select `render.yaml`
5. Click "Apply"

### 4.2 Configure Environment Variables

For **agri-api** service:

```bash
DATABASE_URL="<your-neon-url>"
DIRECT_URL="<your-neon-url>"
R2_ACCOUNT_ID="<your-account-id>"
R2_ACCESS_KEY_ID="<your-access-key>"
R2_SECRET_ACCESS_KEY="<your-secret-key>"
JWT_SECRET="<click-generate-value>"
CORS_ORIGIN="https://agrilogistic.vercel.app"
```

For **agri-ai** service:

```bash
R2_ACCOUNT_ID="<your-account-id>"
R2_ACCESS_KEY_ID="<your-access-key>"
R2_SECRET_ACCESS_KEY="<your-secret-key>"
CORS_ORIGIN="https://agrilogistic.vercel.app"
```

### 4.3 Wait for Deployment

Render will build and deploy both services (~5-10 minutes).

✅ **Checkpoint**: Verify health checks:
- `https://agri-api.onrender.com/health`
- `https://agri-ai.onrender.com/health`

---

## Step 5: Verification (5 minutes)

### 5.1 Test Frontend

1. Visit your Vercel URL
2. Verify pages load correctly
3. Check browser console for errors

### 5.2 Test API Connection

1. Open browser DevTools → Network
2. Navigate through the app
3. Verify API calls to `agri-api.onrender.com` succeed

### 5.3 Test File Upload (Optional)

1. Upload a product image
2. Verify it appears in R2 bucket
3. Verify image loads on frontend

---

## 🎉 Success!

Your AgriLogistic platform is now live on:

- **Frontend**: `https://agrilogistic.vercel.app`
- **API**: `https://agri-api.onrender.com`
- **AI Service**: `https://agri-ai.onrender.com`
- **Database**: Neon PostgreSQL (serverless)
- **Storage**: Cloudflare R2 (zero egress)

**Monthly Cost**: **$0** (within free tiers)

---

## 🔧 Troubleshooting

### Build Fails on Vercel

- Check environment variables are set correctly
- Verify `DATABASE_URL` is accessible from Vercel
- Check build logs for specific errors

### API Returns 500 Errors

- Verify `DATABASE_URL` in Render environment variables
- Check Render logs for connection errors
- Ensure Neon database is not paused (free tier auto-pauses after 7 days inactivity)

### CORS Errors

- Verify `CORS_ORIGIN` in Render matches your Vercel URL
- Check R2 CORS policy includes your Vercel domain
- Ensure no trailing slashes in URLs

### Images Not Loading

- Verify R2 bucket is public (for `agri-products`)
- Check `NEXT_PUBLIC_R2_URL` is set correctly
- Verify `vercel.json` rewrite rule has correct Account ID

---

## 📚 Next Steps

- [ ] Set up custom domain on Vercel
- [ ] Configure monitoring (Sentry, LogRocket)
- [ ] Set up CI/CD with GitHub Actions
- [ ] Enable Neon branching for preview deployments
- [ ] Configure backup strategy

---

## 📖 Additional Resources

- [Environment Variables Guide](./ENVIRONMENT_VARIABLES.md)
- [Neon Setup Guide](./NEON_SETUP.md)
- [R2 Setup Guide](./R2_SETUP.md)
- [Implementation Plan](../CLOUD_NATIVE_NEXT_STEPS.md)
