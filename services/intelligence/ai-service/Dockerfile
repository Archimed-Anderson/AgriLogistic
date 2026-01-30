FROM node:20-bookworm-slim AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY src ./src

RUN npm run build

FROM node:20-bookworm-slim

WORKDIR /app

COPY package*.json ./

RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

COPY --from=builder /app/dist ./dist

# Use the built-in non-root `node` user provided by the official image.
USER node

EXPOSE 8008

CMD ["node", "dist/index.js"]

