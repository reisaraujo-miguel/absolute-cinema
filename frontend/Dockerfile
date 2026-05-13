# Build environment - uses Bun for fast installs and builds
FROM oven/bun:1-alpine AS build-env
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production environment - uses Node.js because @react-router/serve
# depends on Node.js APIs (renderToPipeableStream, etc.) not available in Bun
FROM node:22-alpine AS production
WORKDIR /app

# Copy only what's needed for production
COPY package.json ./
RUN npm install --omit=dev

COPY --from=build-env /app/build ./build

EXPOSE 3000

CMD ["npm", "run", "start"]
