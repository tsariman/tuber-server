# Use Node.js 18 LTS
FROM node:18-alpine

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod=false

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["pnpm", "start"]
