# Development build for AgroDeep Platform with Vite proxy support
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code and config files
COPY . .

# Expose port
EXPOSE 3000

# Set environment to development for Vite proxy
ENV NODE_ENV=development

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --spider -q http://localhost:3000 || exit 1

# Start Vite dev server (supports proxy)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
