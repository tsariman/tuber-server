# ============================================================
# Full-stack Dockerfile
# Build context must be the PARENT directory of all 3 projects:
#   docker build -f tuber-server/Dockerfile -t tuber-app .
# ============================================================

# Stage 1: Build the client
FROM node:22-alpine AS client-build

RUN corepack enable && corepack prepare pnpm@10.31.0 --activate

WORKDIR /build

# Copy and install shared package (dependency of client)
COPY tuber-shared/ ./tuber-shared/
WORKDIR /build/tuber-shared
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Install and build client
COPY tuber-client/package.json tuber-client/pnpm-lock.yaml /build/tuber-client/
WORKDIR /build/tuber-client
RUN pnpm install --frozen-lockfile
COPY tuber-client/ ./
RUN pnpm run build

# Stage 2: Build and run the server
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@10.31.0 --activate

# Copy and install shared package at expected relative location
COPY tuber-shared/ /tuber-shared/
WORKDIR /tuber-shared
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Install server dependencies
WORKDIR /app
COPY tuber-server/package.json tuber-server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy server source and build
COPY tuber-server/ ./
RUN NODE_OPTIONS=--max-old-space-size=1536 pnpm run build:ts

# Copy compiled client from stage 1
COPY --from=client-build /build/tuber-client/dist ./client/

EXPOSE 8080

ENV NODE_ENV=production

CMD ["pnpm", "exec", "fastify", "start", "-a", "0.0.0.0", "-p", "8080", "-l", "info", "dist/app.js"]
