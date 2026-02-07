# Neon PostgreSQL Setup Guide

## Quick Start

### 1. Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up with GitHub or email
3. Create a new project: "agrilogistic-prod"
4. Select region: **EU (Frankfurt)** (closest to Render/Vercel EU)

### 2. Get Connection String
From your Neon dashboard:
1. Click "Connection Details"
2. Copy the **Pooled connection** string (recommended for serverless)
3. Format: `postgresql://user:password@ep-name-123.eu-central-1.aws.neon.tech/agrilogistic?sslmode=require`

### 3. Configure Environment

**Local Development** (`.env`):
```bash
DATABASE_URL="postgresql://user:password@ep-name-123.eu-central-1.aws.neon.tech/agrilogistic?sslmode=require"
```

**Production** (Render/Vercel):
- Add `DATABASE_URL` in dashboard environment variables
- Use the same Neon connection string

### 4. Push Schema to Neon

```bash
# From packages/database directory
DATABASE_URL="<your-neon-url>" npx prisma db push

# Verify tables created
DATABASE_URL="<your-neon-url>" npx prisma studio
```

### 5. Seed Production Data

```bash
DATABASE_URL="<your-neon-url>" pnpm --filter @agrologistic/database run seed
```

## Neon Features

### Database Branching
Create preview databases for each PR:
```bash
# Create branch
neonctl branches create --name preview-pr-123

# Get branch connection string
neonctl connection-string preview-pr-123
```

### Autoscaling
Neon automatically scales compute based on load:
- **Free Tier**: 0.25 CU (1 vCPU, 1GB RAM)
- **Autoscale**: Up to 1 CU during peak load
- **Scale-to-zero**: Pauses after 5 minutes of inactivity

### Monitoring
Check usage in Neon dashboard:
- **Storage**: 0.5GB limit (free tier)
- **Compute**: 100 CU-hours/month (free tier)
- **Data transfer**: Unlimited

## Troubleshooting

### Connection Timeout
If you see `connection timeout`, check:
1. Firewall allows outbound connections to `*.neon.tech`
2. Using **pooled connection** string (not direct)
3. SSL mode is set to `require`

### Migration Errors
For Prisma 7.x deprecation warnings about `url` in schema:
- **Safe to ignore** - This is a known Prisma issue
- The `url` property is still required for `db push`
- Will be fixed in future Prisma versions

### Performance
Optimize for serverless:
1. Use connection pooling (included in Neon pooled URL)
2. Set `pool_timeout = 5` in Prisma config
3. Close connections after each request
