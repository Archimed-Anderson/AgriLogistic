# AgroLogistic - Requirements & Dependencies

## System Requirements

### Required Software
- **Node.js**: 20.x or higher
- **npm**: 10.x or higher
- **Python**: 3.11 or higher (for backend services)
- **PostgreSQL**: 15.x or higher
- **Docker**: 24.x or higher (optional but recommended)
- **Docker Compose**: 2.x or higher (optional but recommended)

### Operating Systems
- Windows 10/11
- macOS 12+
- Linux (Ubuntu 20.04+, Debian 11+)

---

## Frontend Dependencies (AgroDeep/)

### Core Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "typescript": "^5.3.3",
  "vite": "^5.0.8"
}
```

### Admin Dashboard Dependencies (NEW)
```json
{
  "@tanstack/react-query": "^5.17.0",
  "axios": "^1.6.5",
  "recharts": "^2.10.3",
  "react-hook-form": "^7.49.3",
  "@hookform/resolvers": "^3.3.4",
  "zod": "^3.22.4",
  "sonner": "^1.3.1",
  "zustand": "^4.4.7"
}
```

### UI Components
```json
{
  "@radix-ui/react-*": "^1.0.0",
  "tailwindcss": "^3.4.0",
  "lucide-react": "^0.303.0",
  "clsx": "^2.1.0",
  "tailwind-merge": "^2.2.0"
}
```

### Installation
```powershell
cd AgroDeep
npm install

# Install admin dashboard dependencies
npm install @tanstack/react-query axios recharts react-hook-form @hookform/resolvers zod sonner zustand
```

---

## Backend Dependencies

### Admin Service (backend/admin-service/)

**Core Dependencies**
```json
{
  "express": "^4.18.2",
  "typescript": "^5.3.3",
  "pg": "^8.11.3",
  "sequelize": "^6.35.2",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.3.1"
}
```

**Security & Validation**
```json
{
  "helmet": "^7.1.0",
  "cors": "^2.8.5",
  "express-validator": "^7.0.1",
  "speakeasy": "^2.0.0"
}
```

**Testing**
```json
{
  "jest": "^29.7.0",
  "ts-jest": "^29.1.1",
  "supertest": "^6.3.3",
  "@types/jest": "^29.5.11"
}
```

**Installation**
```powershell
cd backend/admin-service
npm install
```

### Python Backend Services

**Requirements** (requirements.txt)
```
fastapi==0.109.0
uvicorn[standard]==0.27.0
sqlalchemy==2.0.25
pydantic==2.5.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
```

**Installation**
```powershell
cd backend
pip install -r requirements.txt
```

---

## Database Requirements

### PostgreSQL Databases

1. **Admin Database**
   - Name: `admin_db`
   - User: `admin`
   - Port: 5433 (Docker) / 5432 (local)

2. **Auth Database**
   - Name: `auth_db`
   - User: `auth`
   - Port: 5432

3. **Main Database**
   - Name: `agrologistic_db`
   - User: `postgres`
   - Port: 5432

---

## Docker Images Required

```yaml
# Core Services
postgres:15-alpine
node:20-alpine
python:3.11-slim

# API Gateway
kong:3.5
kong/kong-gateway:3.5

# Optional
redis:7-alpine
nginx:alpine
```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
VITE_ADMIN_API_URL=http://localhost:5005/api/v1/admin
```

### Admin Service (.env)
```env
NODE_ENV=development
PORT=5005
DATABASE_URL=postgresql://admin:admin@localhost:5433/admin_db
JWT_PUBLIC_KEY_PATH=../auth-service/keys/public.pem
CORS_ORIGIN=http://localhost:5173
```

### Auth Service (.env)
```env
DATABASE_URL=postgresql://auth:auth@localhost:5432/auth_db
JWT_PRIVATE_KEY_PATH=./keys/private.pem
JWT_PUBLIC_KEY_PATH=./keys/public.pem
```

---

## Port Allocations

| Service | Port | Protocol |
|---------|------|----------|
| Frontend (Vite) | 5173 | HTTP |
| Admin Service | 5005 | HTTP |
| Auth Service | 5001 | HTTP |
| Kong Gateway | 8000 | HTTP |
| Kong Admin | 8001 | HTTP |
| PostgreSQL (main) | 5432 | TCP |
| PostgreSQL (admin) | 5433 | TCP |

---

## Installation Scripts

### Windows (PowerShell)
```powershell
# Full installation
.\START_APP_SIMPLE.ps1

# Admin service only
cd backend\admin-service
.\install.ps1
```

### Linux/macOS (Bash)
```bash
# Admin service
cd backend/admin-service
chmod +x install.sh
./install.sh
```

---

## Verification Commands

### Check Node.js
```powershell
node --version  # Should be 20.x+
npm --version   # Should be 10.x+
```

### Check Python
```powershell
python --version  # Should be 3.11+
pip --version
```

### Check Docker
```powershell
docker --version
docker-compose --version
```

### Check PostgreSQL
```powershell
psql --version  # Should be 15.x+
```

---

## Troubleshooting

### Port Already in Use
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID)
taskkill /PID <PID> /F
```

### npm Vulnerabilities
```powershell
# Check vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Fix with breaking changes
npm audit fix --force
```

### Database Connection Issues
```powershell
# Check PostgreSQL is running
docker ps | findstr postgres

# Restart database
docker-compose restart admin-db
```

---

## Security Notes

- ⚠️ Never commit `.env` files
- ⚠️ Use strong passwords in production
- ⚠️ Rotate JWT keys regularly
- ⚠️ Keep dependencies updated
- ⚠️ Run `npm audit` regularly

---

## Update Schedule

- **Dependencies**: Monthly security updates
- **Node.js**: Follow LTS schedule
- **PostgreSQL**: Annual major updates
- **Docker Images**: Quarterly updates

---

**Last Updated**: 2026-01-22
**Version**: 1.0.0
