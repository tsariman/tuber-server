#!/bin/bash

# EC2 Deployment Script for Full-Stack Tuber App
# This script deploys the server with static client files already included

set -e

# Configuration
EC2_HOST="${EC2_HOST:-your-ec2-instance.amazonaws.com}"
EC2_USER="${EC2_USER:-ec2-user}"
APP_NAME="tuber-app"

echo "🚀 Starting deployment to EC2..."

# Create deployment archive
echo "📦 Creating deployment package..."
tar -czf tuber-deployment.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env*' \
    .

# Upload files to EC2
echo "📤 Uploading files to EC2..."
scp tuber-deployment.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/

# Deploy on EC2
echo "🔧 Setting up application on EC2..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    # Stop existing application
    sudo pkill -f "tuber-app" || true
    sudo docker stop tuber-app || true
    sudo docker rm tuber-app || true

    # Create app directory
    sudo mkdir -p /opt/tuber-app
    cd /opt/tuber-app

    # Extract application
    sudo tar -xzf /tmp/tuber-deployment.tar.gz

    # Build Docker image
    sudo docker build -t tuber-app .

    # Run container
    sudo docker run -d \
        --name tuber-app \
        --restart unless-stopped \
        -p 80:8080 \
        -e NODE_ENV=production \
        tuber-app

    # Clean up
    rm -f /tmp/tuber-deployment.tar.gz

    echo "✅ Deployment complete!"
EOF

# Clean up local files
rm -f tuber-deployment.tar.gz

echo "🎉 Deployment successful!"
echo "Your app should be accessible at http://${EC2_HOST}"
