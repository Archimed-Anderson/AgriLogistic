# Cloudflare R2 Setup Guide

## Overview
Cloudflare R2 is S3-compatible object storage with **zero egress fees**. Perfect for serving product images, user uploads, and documents without unexpected bandwidth costs.

## Quick Start

### 1. Create Cloudflare Account
1. Go to [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. Sign up and verify email
3. Navigate to **R2 Object Storage** in sidebar

### 2. Create Buckets

Create the following buckets:

| Bucket Name | Access | Purpose |
|-------------|--------|---------|
| `agri-products` | Public | Product images, thumbnails |
| `agri-kyc` | Private | KYC documents, ID cards |
| `agri-pods` | Private | Proof of delivery photos |
| `agri-diagnostics` | Private | Plant disease images |
| `agri-contracts` | Private | Signed PDF contracts |

**Steps**:
1. Click "Create bucket"
2. Enter bucket name
3. For public buckets: Enable "Public access"
4. Click "Create bucket"

### 3. Get API Credentials

1. Go to **R2 → Manage R2 API Tokens**
2. Click "Create API token"
3. Name: "agrilogistic-prod"
4. Permissions: **Object Read & Write**
5. Copy:
   - **Access Key ID**
   - **Secret Access Key**
   - **Account ID** (from R2 overview page)

### 4. Configure CORS

For each bucket, set CORS policy:

```json
[
  {
    "AllowedOrigins": [
      "https://agrilogistic.vercel.app",
      "https://*.vercel.app"
    ],
    "AllowedMethods": ["GET", "PUT", "POST"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

**Steps**:
1. Select bucket
2. Go to **Settings → CORS policy**
3. Paste JSON above
4. Click "Save"

### 5. Environment Variables

Add to `.env.production`:

```bash
R2_ACCOUNT_ID="your-account-id"
R2_ACCESS_KEY_ID="your-access-key-id"
R2_SECRET_ACCESS_KEY="your-secret-access-key"
R2_PUBLIC_URL="https://agri-products.your-account-id.r2.cloudflarestorage.com"
```

## Usage Examples

### Generate Upload URL (Backend)

```typescript
import { getR2Client } from '@agrologistic/storage';

const r2 = getR2Client();

// Generate presigned URL for client-side upload
const uploadUrl = await r2.generateUploadUrl({
  bucket: 'agri-products',
  key: `products/${productId}/image.jpg`,
  contentType: 'image/jpeg',
  expiresIn: 900, // 15 minutes
});

// Return to client
res.json({ uploadUrl });
```

### Upload from Client (Frontend)

```typescript
// Client receives uploadUrl from backend
const response = await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': 'image/jpeg',
  },
  body: imageFile,
});

if (response.ok) {
  console.log('Upload successful!');
}
```

### Generate Download URL (Private Files)

```typescript
// For private files (KYC, contracts)
const downloadUrl = await r2.generateDownloadUrl({
  bucket: 'agri-kyc',
  key: `users/${userId}/id-card.pdf`,
  expiresIn: 3600, // 1 hour
});

// Send to authorized user only
res.json({ downloadUrl });
```

### Public URL (Public Buckets)

```typescript
// For public files (product images)
const publicUrl = r2.getPublicUrl(
  process.env.R2_ACCOUNT_ID!,
  'agri-products',
  `products/${productId}/image.jpg`
);

// Use directly in <img> tags
<img src={publicUrl} alt="Product" />
```

## Cost Optimization

### Free Tier (Forever)
- **Storage**: 10 GB
- **Class A Operations**: 1 million/month (PUT, POST, LIST)
- **Class B Operations**: 10 million/month (GET, HEAD)
- **Egress**: **UNLIMITED** (zero fees!)

### Paid Tier (After Free Tier)
- **Storage**: $0.015/GB/month
- **Class A**: $4.50/million requests
- **Class B**: $0.36/million requests
- **Egress**: **$0** (always free!)

**Example**: 50GB storage + 5M requests = ~$2/month (vs $50-200/month on AWS S3)

## Best Practices

### 1. Use Presigned URLs
Never expose R2 credentials to the client. Always generate presigned URLs from the backend.

### 2. Set Expiration Times
- **Upload URLs**: 15 minutes (900s)
- **Download URLs**: 1 hour (3600s)
- **Public URLs**: No expiration needed

### 3. Organize by Prefix
Use consistent key structure:
```
products/{productId}/{filename}
users/{userId}/kyc/{filename}
diagnostics/{diagnosisId}/{filename}
```

### 4. Enable Versioning (Optional)
For critical files (contracts), enable versioning in bucket settings.

## Troubleshooting

### CORS Errors
If you see CORS errors in browser:
1. Check CORS policy includes your domain
2. Verify `AllowedMethods` includes the HTTP method you're using
3. Clear browser cache

### Upload Fails
If presigned URL upload fails:
1. Check URL hasn't expired (15 min default)
2. Verify `Content-Type` header matches
3. Check file size doesn't exceed limits

### Access Denied
If you get 403 errors:
1. Verify API token has correct permissions
2. Check bucket access settings (public vs private)
3. For private buckets, use presigned URLs

## Migration from Local Storage

To migrate existing files from local storage to R2:

```bash
# Install AWS CLI
npm install -g @aws-sdk/client-s3

# Configure credentials
export AWS_ACCESS_KEY_ID="your-r2-access-key"
export AWS_SECRET_ACCESS_KEY="your-r2-secret-key"
export AWS_ENDPOINT_URL="https://your-account-id.r2.cloudflarestorage.com"

# Sync directory to R2
aws s3 sync ./local-uploads s3://agri-products/products/ --endpoint-url $AWS_ENDPOINT_URL
```
