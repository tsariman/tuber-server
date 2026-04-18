# PowerShell EC2 Deployment Script for Full-Stack Tuber App
# Run from the PARENT directory of tuber-server, tuber-client, tuber-shared
param(
    [string]$EC2Host = $env:EC2_HOST,
    [string]$EC2User = "ec2-user",
    [string]$KeyPath = $env:EC2_KEY_PATH,
    [string]$PublicOrigin = $env:PUBLIC_ORIGIN
)

if (-not $EC2Host) {
    Write-Host "Please set EC2_HOST environment variable or pass -EC2Host parameter" -ForegroundColor Red
    exit 1
}

if (-not $KeyPath) {
    Write-Host "Please set EC2_KEY_PATH environment variable or pass -KeyPath parameter" -ForegroundColor Red
    exit 1
}

if ($null -eq $PublicOrigin) {
    $PublicOrigin = ""
}
$PublicOrigin = $PublicOrigin.Trim()

$envFile = Join-Path $PSScriptRoot ".env.production.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Production env file not found at $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "Starting deployment to EC2..." -ForegroundColor Green
if ($PublicOrigin) {
    Write-Host "Public origin override: $PublicOrigin" -ForegroundColor Cyan
} else {
    Write-Host "Public origin will be read from .env.production.local" -ForegroundColor Cyan
}

# Must run from parent directory containing all three project folders
$parentDir = Split-Path -Parent $PSScriptRoot

Write-Host "Creating deployment package from $parentDir ..." -ForegroundColor Yellow
Push-Location $parentDir

tar -czf tuber-deployment.tar.gz `
    --exclude='node_modules' `
    --exclude='.git' `
    --exclude='*.log' `
    --exclude='.env*' `
    --exclude='dist' `
    --exclude='coverage' `
    tuber-server tuber-client tuber-shared

# Upload files to EC2
Write-Host "Uploading files to EC2..." -ForegroundColor Yellow
scp -i $KeyPath tuber-deployment.tar.gz "${EC2User}@${EC2Host}:~/tuber-deployment.tar.gz"
scp -i $KeyPath $envFile "${EC2User}@${EC2Host}:~/tuber-server.env.production.local"

# Deploy on EC2
Write-Host "Setting up application on EC2..." -ForegroundColor Yellow
$deployScript = @"
set -euo pipefail

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
sudo tar -xzf /home/${EC2User}/tuber-deployment.tar.gz
sudo mkdir -p /opt/tuber-app/tuber-server
sudo mv /home/${EC2User}/tuber-server.env.production.local /opt/tuber-app/tuber-server/.env.production.local
sudo python3 - <<'PY'
from pathlib import Path
from urllib.parse import urlparse
import ipaddress

path = Path('/opt/tuber-app/tuber-server/.env.production.local')
text = path.read_text()
updates = {}
public_origin = '${PublicOrigin}'.strip()
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

# Build Docker image (context = parent dir with all 3 projects)
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
rm -f /home/${EC2User}/tuber-deployment.tar.gz

echo "Deployment complete!"
"@

$deployScript = $deployScript -replace "`r", ""
$deployScript | ssh -i $KeyPath "${EC2User}@${EC2Host}" "bash -s"

if ($LASTEXITCODE -ne 0) {
    Pop-Location
    Remove-Item "$parentDir\tuber-deployment.tar.gz" -ErrorAction SilentlyContinue
    Write-Host "Deployment failed on remote host." -ForegroundColor Red
    exit 1
}

Pop-Location

# Clean up local files
Remove-Item "$parentDir\tuber-deployment.tar.gz" -ErrorAction SilentlyContinue

Write-Host "Deployment successful!" -ForegroundColor Green
if ($PublicOrigin) {
    Write-Host "Your app should be accessible at $PublicOrigin" -ForegroundColor Cyan
} else {
    Write-Host "Your app should be accessible at the PUBLIC_ORIGIN configured in .env.production.local" -ForegroundColor Cyan
}
