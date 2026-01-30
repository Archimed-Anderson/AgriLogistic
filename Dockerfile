# =============================================================================
# Multi-stage Dockerfile for AgroLogistic Platform
# Optimized for pnpm and Turborepo with minimal image size
# =============================================================================

FROM node:20-alpine AS base

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

# Install system dependencies
RUN apk add --no-cache libc6-compat

# =============================================================================
# Phase 1: Pruner - Prune Turborepo workspace for specific service
# =============================================================================
FROM base AS pruner

WORKDIR /app

# Install turbo globally for pruning
RUN pnpm add -g turbo

# Copy all files needed for pruning
COPY . .

ARG SERVICE_NAME

# Prune the workspace for the specific service
RUN turbo prune --scope=${SERVICE_NAME} --docker

# =============================================================================
# Phase 2: Installer - Install dependencies with pnpm
# =============================================================================
FROM base AS installer

WORKDIR /app

# Copy package files from pruner
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install dependencies with frozen lockfile for reproducible builds
RUN pnpm install --frozen-lockfile

# =============================================================================
# Phase 3: Builder - Build the service
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copy node_modules from installer
COPY --from=installer /app/node_modules ./node_modules

# Copy source code from pruner
COPY --from=pruner /app/out/full/ .

# Copy turbo.json for build configuration
COPY turbo.json turbo.json

ARG SERVICE_NAME

# Build the service using turbo
RUN pnpm turbo run build --filter=${SERVICE_NAME}

# =============================================================================
# Phase 4: Runner - Minimal runtime image
# =============================================================================
FROM base AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# Switch to non-root user
USER appuser

# Copy built application from builder
COPY --from=builder /app .

# NOTE: You must overwrite CMD at runtime or in a specific child Dockerfile
# Example: CMD ["node", "services/path/to/dist/index.js"]
