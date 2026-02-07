# ============================================================================
# AgriCredit Service - Multi-stage Dockerfile
# ============================================================================
# Stages: development, builder, production
# Base image: Node.js 18 Alpine + Python 3.11

# ==========================================================================
# Base Stage - Common dependencies
# ==========================================================================
FROM node:18-alpine AS base

# Install Python and build dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    build-base \
    postgresql-dev \
    curl

# Create app directory
WORKDIR /app

# ==========================================================================
# Development Stage
# ==========================================================================
FROM base AS development

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install Node dependencies
RUN pnpm install

# Copy Python requirements
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Generate Prisma client
RUN pnpm prisma:generate

# Expose port
EXPOSE 3008

# Start in development mode
CMD ["pnpm", "start:dev"]

# ==========================================================================
# Builder Stage - Build application
# ==========================================================================
FROM base AS builder

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml* ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies (production only)
RUN pnpm install --prod --frozen-lockfile

# Copy application code
COPY . .

# Generate Prisma client
RUN pnpm prisma:generate

# Build application
RUN pnpm build

# ==========================================================================
# Production Stage - Optimized runtime
# ==========================================================================
FROM node:18-alpine AS production

# Install Python runtime (no build tools)
RUN apk add --no-cache \
    python3 \
    py3-pip \
    curl \
    && rm -rf /var/cache/apk/*

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Copy Python requirements and install
COPY --chown=nestjs:nodejs requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Copy ML models and scripts
COPY --chown=nestjs:nodejs ml ./ml

# Copy Prisma schema
COPY --chown=nestjs:nodejs prisma ./prisma

# Create logs directory
RUN mkdir -p logs && chown -R nestjs:nodejs logs

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3008

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3008/api/v1/credit/health || exit 1

# Start application
CMD ["node", "dist/main.js"]
