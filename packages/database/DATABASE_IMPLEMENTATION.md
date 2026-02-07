# Database Integration Layer - Implementation Guide

## Overview

This package (`@agrologistic/database`) provides a unified, type-safe database integration layer for the entire platform. It follows the **Repository Pattern** to abstract database operations and ensure consistent data handling across microservices and the frontend.

## 1. Schema Design Decisions

The database is built on **PostgreSQL** with **Prisma ORM**. It follows 3rd Normal Form (3NF) and includes:

### Core Units:
- **Identity & Access**: Unified `User` model with `UserRole` enum (ADMIN, FARMER, etc.).
- **Logistics**: `Mission`, `Vehicle`, and `MissionEvent` for fleet tracking.
- **Agriculture**: `FarmerProfile`, `Harvest`, and `AgriScore` for production data.
- **Marketplace**: `Product`, `Order`, and `Payment` for trading logs.
- **Infrastructure**: `IoTDevice` and `Telemetry` for hardware integration.
- **Incidents**: `Incident` model for War Room monitoring.

### Key Features:
- **Indexes**: Applied on `email`, `role`, `status`, `severity`, and `createdAt` for high-performance querying.
- **Transactions**: Complex operations (like status updates with logging) are wrapped in Prisma Transactions.
- **Cascades**: `onDelete: Cascade` applied to user profiles and related transient data.

## 2. Migration Management

Prisma Migrate handles timestamped schema versions.

### Commands:
- `pnpm run generate`: Regenerate the Prisma Client.
- `pnpm run migrate:dev`: Create and apply a new migration in development.
- `pnpm run seed`: Populate the database with initial data.
- `pnpm run push`: Push schema changes directly (for fast prototyping).

## 3. Repository Pattern

Every major entity has a corresponding Repository class extending `BaseRepository`.

### Usage Example:

```typescript
import { AgriDB } from '@agrologistic/database';

const db = AgriDB.create();

// Find a user and their profile
const user = await db.users.findFirst({
  where: { email: 'farmer@demo.com' },
  include: { farmerProfile: true }
});

// Update mission status with automatic event logging
await db.missions.updateStatus(
  'mission_id_123',
  'IN_TRANSIT',
  'Vehicle picked up cargo at origin.'
);

// Paginated query
const missions = await db.missions.findPaginated({
  page: 1,
  pageSize: 10,
  where: { status: 'PENDING' }
});
```

## 4. Testing & Reliability

- **Unit Testing**: Repositories are designed to be easily mocked using `jest-mock-extended` or similar tools with the `PrismaClient`.
- **Referential Integrity**: Constraints are enforced at the database level.
- **Type Safety**: Full TypeScript support with generated types from the schema.
