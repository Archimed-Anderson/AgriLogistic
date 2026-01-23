# Admin Service - Quick Start Guide

## 🚀 Quick Start (5 minutes)

### Option 1: Docker (Recommended)

```bash
cd backend/admin-service
docker-compose up -d
```

That's it! The service is running on `http://localhost:5005`

### Option 2: Local Development

```bash
cd backend/admin-service

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 📝 Testing the API

### Using Postman

1. Import `postman_collection.json`
2. Set the `admin_token` variable with a valid JWT
3. Start making requests!

### Using curl

```bash
# Health check (no auth required)
curl http://localhost:5005/api/v1/admin/health

# List users (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5005/api/v1/admin/users

# Get dashboard metrics
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5005/api/v1/admin/dashboard/metrics
```

## 🔑 Authentication

All endpoints (except `/health`) require a valid JWT token from the auth-service.

The token must include admin roles in the claims:
- `SUPER_ADMIN`
- `ADMIN`
- `MANAGER`
- `SUPPORT`

## 📊 Available Endpoints

### Users Management
- `GET /api/v1/admin/users` - List users
- `POST /api/v1/admin/users` - Create user
- `PATCH /api/v1/admin/users/:id` - Update user
- `DELETE /api/v1/admin/users/:id` - Delete user
- `POST /api/v1/admin/users/:id/suspend` - Suspend user
- `POST /api/v1/admin/users/:id/activate` - Activate user

### Dashboard
- `GET /api/v1/admin/dashboard/metrics` - Get metrics
- `GET /api/v1/admin/dashboard/alerts` - Get alerts
- `GET /api/v1/admin/dashboard/activity` - Get activity

### System
- `GET /api/v1/admin/system/health` - Services health
- `GET /api/v1/admin/system/metrics` - System metrics
- `GET /api/v1/admin/system/logs` - System logs

## 🧪 Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 🐛 Troubleshooting

### Database connection error
- Ensure PostgreSQL is running
- Check `DATABASE_URL` in `.env`
- With Docker: `docker-compose logs admin-db`

### JWT verification error
- Ensure `JWT_PUBLIC_KEY_PATH` points to the correct key
- Verify the auth-service is running
- Check token expiration

### Port already in use
- Change `PORT` in `.env`
- Or stop the conflicting service

## 📚 Next Steps

1. **Integrate with Kong**: See `ADMIN_SERVICE_INTEGRATION.md`
2. **Add more tests**: Coverage target is 80%
3. **Implement 2FA**: Speakeasy is already installed
4. **Add real monitoring**: Replace mock data in services

## 🔗 Related Documentation

- [Full README](README.md)
- [Integration Plan](../../ADMIN_SERVICE_INTEGRATION.md)
- [API Documentation](postman_collection.json)

## 💡 Tips

- Use `npm run typecheck` before committing
- Enable auto-sync in development (already configured)
- Check audit logs in the database for all admin actions
- Use Docker for consistent environment

---

**Need help?** Check the logs:
```bash
# Docker
docker-compose logs -f admin-service

# Local
# Logs are printed to console
```
