#!/bin/bash

# EC2 Deployment Script for Full-Stack Tuber App
# Run from the PARENT directory of tuber-server, tuber-client, tuber-shared

set -e

# Configuration
EC2_HOST="${EC2_HOST:-your-ec2-instance.amazonaws.com}"
EC2_USER="${EC2_USER:-ec2-user}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"

echo "Starting deployment to EC2..."

# Create deployment archive from parent directory
echo "Creating deployment package from $PARENT_DIR ..."
cd "$PARENT_DIR"

tar -czf tuber-deployment.tar.gz \
    --exclude='node_modules' \
    --exclude='.git' \
    --exclude='*.log' \
    --exclude='.env*' \
    --exclude='dist' \
    --exclude='coverage' \
    tuber-server tuber-client tuber-shared

# Upload files to EC2
echo "Uploading files to EC2..."
scp tuber-deployment.tar.gz ${EC2_USER}@${EC2_HOST}:/tmp/

# Deploy on EC2
echo "Setting up application on EC2..."
ssh ${EC2_USER}@${EC2_HOST} << 'EOF'
    # Stop existing application
    sudo docker stop tuber-app 2>/dev/null || true
    sudo docker rm tuber-app 2>/dev/null || true

    # Create app directory
    sudo mkdir -p /opt/tuber-app
    cd /opt/tuber-app

    # Extract application
    sudo tar -xzf /tmp/tuber-deployment.tar.gz

    # Build Docker image (context = parent dir with all 3 projects)
    sudo docker build -f tuber-server/Dockerfile -t tuber-app .

    # Run container with env file
    sudo docker run -d \
        --name tuber-app \
        --restart unless-stopped \
        -p 80:8080 \
        --env-file /opt/tuber-app/tuber-server/.env.production.local \
        tuber-app

    # Clean up
    rm -f /tmp/tuber-deployment.tar.gz

    echo "Deployment complete!"
EOF

# Clean up local files
rm -f tuber-deployment.tar.gz

echo "Deployment successful!"
echo "Your app should be accessible at http://${EC2_HOST}"
