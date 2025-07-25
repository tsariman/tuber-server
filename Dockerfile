# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile --production=false

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 8080

# Set environment
ENV NODE_ENV=production

# Start the application
CMD ["yarn", "start"]
