FROM node:20-alpine
WORKDIR /app
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm install && npm run build && npm prune --omit=dev
EXPOSE 3018
ENV PORT=3018
CMD ["node", "dist/index.js"]
