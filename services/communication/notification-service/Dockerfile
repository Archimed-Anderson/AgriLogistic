FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# notification-service currently has no explicit tsconfig at root; use default tsc config if present later.
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY tsconfig.json ./
COPY src ./src

# Build TypeScript if configured; otherwise fail fast with clear message.
RUN if [ -f tsconfig.json ]; then npm run build; else echo "Missing tsconfig.json for notification-service" >&2; exit 1; fi

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

COPY --from=builder /app/dist ./dist

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 8006

CMD ["node", "dist/index.js"]

