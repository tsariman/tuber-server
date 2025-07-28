#!/bin/bash

# Production Deployment Script with JWT Key Rotation
# This script sets up your tuber-server with secure JWT key rotation

echo "🚀 Starting Tuber Server Production Deployment..."

# Check if .env.production exists
if [ ! -f ".env.production" ]; then
    echo "❌ .env.production file not found!"
    echo "📝 Please copy .env.production.example to .env.production and configure it"
    echo "   cp .env.production.example .env.production"
    exit 1
fi

# Set production environment
export NODE_ENV=production

# Load production environment variables
source .env.production

echo "✅ Environment: $NODE_ENV"
echo "✅ Domain: $DOMAIN"
echo "✅ Client Domain: $CLIENT_DOMAIN"

# Build the application
echo "🏗️  Building application..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "❌ Build failed!"
    exit 1
fi

echo "✅ Build completed successfully"

# Initialize JWT key rotation
echo "🔐 Initializing JWT key rotation..."
echo "   - Total rotation keys available: $(node -e "console.log(require('./dist/session.secrets.js').default.length)")"
echo "   - Key rotation interval: 24 hours (configurable)"
echo "   - Active verification keys: 3 (current + 2 previous)"

# Database connection check
echo "🗄️  Checking database connection..."
if ! mongo --eval "db.runCommand('ping').ok" "$MONGODB_URI" --quiet; then
    echo "❌ Database connection failed!"
    echo "Please check your MONGODB_URI in .env.production"
    exit 1
fi
echo "✅ Database connection successful"

# Start the application with PM2 for production
echo "🌟 Starting application with PM2..."

# Stop existing process if running
pm2 stop tuber-server 2>/dev/null || true
pm2 delete tuber-server 2>/dev/null || true

# Start with ecosystem file
pm2 start ecosystem.config.json

# Save PM2 configuration
pm2 save
pm2 startup

echo "🎉 Deployment completed successfully!"
echo ""
echo "📊 Monitoring Commands:"
echo "   pm2 status              - Check application status"
echo "   pm2 logs tuber-server   - View application logs"
echo "   pm2 monit              - Real-time monitoring"
echo ""
echo "🔐 JWT Management:"
echo "   curl http://localhost:8080/admin/jwt/status    - Check rotation status"
echo "   curl -X POST http://localhost:8080/admin/jwt/rotate - Manual key rotation"
echo ""
echo "🔒 Security Notes:"
echo "   - JWT keys rotate automatically every 24 hours"
echo "   - Previous keys remain valid for seamless transitions"
echo "   - Monitor key rotation status via admin endpoints"
echo "   - Keys are sourced from session.secrets.ts (keep this file secure!)"
