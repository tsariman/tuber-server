#!/bin/bash

# EC2 Deployment Script for Full-Stack Tuber App
# Run from the PARENT directory of tuber-server, tuber-client, tuber-shared

set -e

# Configuration
EC2_HOST="${EC2_HOST:-your-ec2-instance.amazonaws.com}"
EC2_USER="${EC2_USER:-ec2-user}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${SCRIPT_DIR}/.env.production.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Production env file not found at $ENV_FILE"
    exit 1
fi

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
scp "$ENV_FILE" ${EC2_USER}@${EC2_HOST}:/tmp/tuber-server.env.production.local

# Deploy on EC2
echo "Setting up application on EC2..."
ssh ${EC2_USER}@${EC2_HOST} "EC2_HOST='${EC2_HOST}' bash -s" << 'EOF'
    # Stop existing application
    sudo docker stop tuber-app 2>/dev/null || true
    sudo docker rm tuber-app 2>/dev/null || true

    # Create app directory
    sudo mkdir -p /opt/tuber-app
    cd /opt/tuber-app

    # Extract application
    sudo tar -xzf /tmp/tuber-deployment.tar.gz
    sudo mkdir -p /opt/tuber-app/tuber-server
    sudo mv /tmp/tuber-server.env.production.local /opt/tuber-app/tuber-server/.env.production.local
    sudo python3 - <<PY
from pathlib import Path
path = Path('/opt/tuber-app/tuber-server/.env.production.local')
text = path.read_text()
updates = {
    'APP_BASE_URL': f'http://{"$EC2_HOST"}',
    'CLIENT_DOMAIN': f'http://{"$EC2_HOST"}',
    'DOMAIN': f'http://{"$EC2_HOST"}'
}
for key, value in updates.items():
    marker = f'{key}='
    lines = text.splitlines()
    replaced = False
    for i, line in enumerate(lines):
        if line.startswith(marker):
            lines[i] = f'{key}={value}'
            replaced = True
            break
    if not replaced:
        lines.append(f'{key}={value}')
    text = '\n'.join(lines) + '\n'
path.write_text(text)
PY
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
