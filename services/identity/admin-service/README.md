# Admin Service

Backend microservice for AgroLogistic admin dashboard management.

## Features

- ✅ User management (CRUD operations)
- ✅ Role-based access control
- ✅ Dashboard metrics and analytics
- ✅ System monitoring
- ✅ Audit logging
- ✅ JWT authentication
- ✅ Permission-based authorization

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15
- **ORM**: Sequelize
- **Authentication**: JWT (RS256)

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
```

### Running Locally

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Running with Docker

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f admin-service

# Stop services
docker-compose down
```

## API Endpoints

### Users Management

- `GET /api/v1/admin/users` - List users
- `GET /api/v1/admin/users/:id` - Get user details
- `POST /api/v1/admin/users` - Create user
- `PATCH /api/v1/admin/users/:id` - Update user
- `DELETE /api/v1/admin/users/:id` - Delete user
- `POST /api/v1/admin/users/:id/suspend` - Suspend user
- `POST /api/v1/admin/users/:id/activate` - Activate user
- `POST /api/v1/admin/users/:id/role` - Assign role
- `POST /api/v1/admin/users/:id/reset-password` - Reset password

### Dashboard

- `GET /api/v1/admin/dashboard/metrics` - Get dashboard metrics
- `GET /api/v1/admin/dashboard/alerts` - Get system alerts
- `POST /api/v1/admin/dashboard/alerts/:id/dismiss` - Dismiss alert
- `GET /api/v1/admin/dashboard/activity` - Get recent activity

### System Monitoring

- `GET /api/v1/admin/system/health` - Services health check
- `GET /api/v1/admin/system/metrics` - System metrics
- `GET /api/v1/admin/system/logs` - System logs
- `POST /api/v1/admin/system/services/:name/restart` - Restart service

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token must include admin roles in the claims.

## Environment Variables

See `.env.example` for all available configuration options.

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint
```

## Database Migrations

The service uses Sequelize with auto-sync in development mode. For production, migrations should be managed separately.

## Security

- JWT RS256 signature verification
- Role-based access control (RBAC)
- Permission-based authorization
- Audit logging for all actions
- Rate limiting (configured in Kong)
- CORS protection
- Helmet security headers

## License

MIT
