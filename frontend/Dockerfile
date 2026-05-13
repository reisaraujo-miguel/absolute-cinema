FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install dependencies
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Build environment
FROM oven/bun:1-alpine AS build-env
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production environment
FROM oven/bun:1-alpine AS production
WORKDIR /app

# Copy only what's needed for production
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=build-env /app/build ./build

EXPOSE 8080

CMD ["bun", "run", "start"]
