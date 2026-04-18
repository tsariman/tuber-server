#!/bin/bash

# EC2 Deployment Script for Full-Stack Tuber App
# Run from the PARENT directory of tuber-server, tuber-client, tuber-shared

set -e

# Configuration
EC2_HOST="${EC2_HOST:-your-ec2-instance.amazonaws.com}"
EC2_USER="${EC2_USER:-ec2-user}"
PUBLIC_ORIGIN="${PUBLIC_ORIGIN:-}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARENT_DIR="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${SCRIPT_DIR}/.env.production.local"

if [ ! -f "$ENV_FILE" ]; then
    echo "Production env file not found at $ENV_FILE"
    exit 1
fi

echo "Starting deployment to EC2..."
if [ -n "$PUBLIC_ORIGIN" ]; then
    echo "Public origin override: $PUBLIC_ORIGIN"
else
    echo "Public origin will be read from .env.production.local"
fi

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
scp tuber-deployment.tar.gz ${EC2_USER}@${EC2_HOST}:~/tuber-deployment.tar.gz
scp "$ENV_FILE" ${EC2_USER}@${EC2_HOST}:~/tuber-server.env.production.local

# Deploy on EC2
echo "Setting up application on EC2..."
ssh ${EC2_USER}@${EC2_HOST} "EC2_HOST='${EC2_HOST}' PUBLIC_ORIGIN='${PUBLIC_ORIGIN}' bash -s" << 'EOF'
    # Stop existing application
    sudo docker stop tuber-app 2>/dev/null || true
    sudo docker rm tuber-app 2>/dev/null || true
    sudo docker stop tuber-proxy 2>/dev/null || true
    sudo docker rm tuber-proxy 2>/dev/null || true
    sudo docker network create tuber-net 2>/dev/null || true

    # Create app directory
    sudo mkdir -p /opt/tuber-app
    cd /opt/tuber-app

    # Extract application
    sudo rm -rf /opt/tuber-app/tuber-server /opt/tuber-app/tuber-client /opt/tuber-app/tuber-shared
    sudo tar -xzf /home/${EC2_USER}/tuber-deployment.tar.gz
    sudo mkdir -p /opt/tuber-app/tuber-server
    sudo mv /home/${EC2_USER}/tuber-server.env.production.local /opt/tuber-app/tuber-server/.env.production.local
    sudo python3 - <<PY
from pathlib import Path
from urllib.parse import urlparse
import ipaddress

path = Path('/opt/tuber-app/tuber-server/.env.production.local')
text = path.read_text()
updates = {}
public_origin = '${PUBLIC_ORIGIN}'.strip()
if public_origin:
    updates = {
        'PUBLIC_ORIGIN': public_origin,
        'APP_BASE_URL': public_origin,
        'CLIENT_DOMAIN': public_origin,
        'DOMAIN': public_origin
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

origin = updates.get('PUBLIC_ORIGIN')
host = ''
if origin:
    host = (urlparse(origin).hostname or '').lower()
canonical_host = host[4:] if host.startswith('www.') else host
try:
    ipaddress.ip_address(canonical_host)
    enable_https = False
except ValueError:
    enable_https = bool(canonical_host and canonical_host != 'localhost')

caddy_path = Path('/opt/tuber-app/Caddyfile')
if enable_https:
    caddy = f'''http://{canonical_host}, http://www.{canonical_host} {{
    redir https://{canonical_host}{{uri}} permanent
}}

https://www.{canonical_host} {{
    redir https://{canonical_host}{{uri}} permanent
}}

https://{canonical_host} {{
    encode gzip
    reverse_proxy tuber-app:8080
}}
'''
    caddy_path.write_text(caddy)
elif caddy_path.exists():
    caddy_path.unlink()
PY
    sudo docker build -f tuber-server/Dockerfile -t tuber-app .

    # Run app container with env file
    sudo docker run -d \
        --name tuber-app \
        --restart unless-stopped \
        --network tuber-net \
        --env-file /opt/tuber-app/tuber-server/.env.production.local \
        tuber-app

    # Enable HTTPS and www redirect when using a real domain name
    if [ -f /opt/tuber-app/Caddyfile ]; then
        sudo docker run -d \
            --name tuber-proxy \
            --restart unless-stopped \
            --network tuber-net \
            -p 80:80 \
            -p 443:443 \
            -v /opt/tuber-app/Caddyfile:/etc/caddy/Caddyfile:ro \
            -v caddy_data:/data \
            -v caddy_config:/config \
            caddy:2
    else
        sudo docker stop tuber-proxy 2>/dev/null || true
        sudo docker rm tuber-proxy 2>/dev/null || true
        sudo docker run -d \
            --name tuber-proxy \
            --restart unless-stopped \
            --network tuber-net \
            -p 80:80 \
            caddy:2 caddy reverse-proxy --from :80 --to tuber-app:8080
    fi

    # Clean up
    rm -f /home/${EC2_USER}/tuber-deployment.tar.gz

    echo "Deployment complete!"
EOF

# Clean up local files
rm -f tuber-deployment.tar.gz

echo "Deployment successful!"
if [ -n "$PUBLIC_ORIGIN" ]; then
    echo "Your app should be accessible at ${PUBLIC_ORIGIN}"
else
    echo "Your app should be accessible at the PUBLIC_ORIGIN configured in .env.production.local"
fi
