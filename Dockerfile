# ============================================================
# Full-stack Dockerfile
# Build context must be the PARENT directory of all 3 projects:
#   docker build -f tuber-server/Dockerfile -t tuber-app .
# ============================================================

# Stage 1: Build the client
FROM node:18-alpine AS client-build

RUN corepack enable && corepack prepare pnpm@10.31.0 --activate

WORKDIR /build

# Copy and install shared package (dependency of client)
COPY tuber-shared/ ./tuber-shared/
WORKDIR /build/tuber-shared
RUN pnpm install --frozen-lockfile

# Install and build client
COPY tuber-client/package.json tuber-client/pnpm-lock.yaml /build/tuber-client/
WORKDIR /build/tuber-client
RUN pnpm install --frozen-lockfile
COPY tuber-client/ ./
RUN pnpm run build

# Stage 2: Build and run the server
FROM node:18-alpine

RUN corepack enable && corepack prepare pnpm@10.31.0 --activate

# Copy and install shared package at expected relative location
COPY tuber-shared/ /tuber-shared/
WORKDIR /tuber-shared
RUN pnpm install --frozen-lockfile

# Install server dependencies
WORKDIR /app
COPY tuber-server/package.json tuber-server/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Copy server source and build
COPY tuber-server/ ./
RUN pnpm run build:ts

# Copy compiled client from stage 1
COPY --from=client-build /build/tuber-client/dist ./client/

EXPOSE 8080

ENV NODE_ENV=production

CMD ["pnpm", "start"]
