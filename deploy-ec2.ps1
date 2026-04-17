# PowerShell EC2 Deployment Script for Full-Stack Tuber App
# Run from the PARENT directory of tuber-server, tuber-client, tuber-shared
param(
    [string]$EC2Host = $env:EC2_HOST,
    [string]$EC2User = "ec2-user",
    [string]$KeyPath = $env:EC2_KEY_PATH
)

if (-not $EC2Host) {
    Write-Host "Please set EC2_HOST environment variable or pass -EC2Host parameter" -ForegroundColor Red
    exit 1
}

if (-not $KeyPath) {
    Write-Host "Please set EC2_KEY_PATH environment variable or pass -KeyPath parameter" -ForegroundColor Red
    exit 1
}

$envFile = Join-Path $PSScriptRoot ".env.production.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Production env file not found at $envFile" -ForegroundColor Red
    exit 1
}

Write-Host "Starting deployment to EC2..." -ForegroundColor Green

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
scp -i $KeyPath tuber-deployment.tar.gz "${EC2User}@${EC2Host}:/tmp/"
scp -i $KeyPath $envFile "${EC2User}@${EC2Host}:/tmp/tuber-server.env.production.local"

# Deploy on EC2
Write-Host "Setting up application on EC2..." -ForegroundColor Yellow
$deployScript = @"
set -euo pipefail

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
sudo python3 - <<'PY'
from pathlib import Path
path = Path('/opt/tuber-app/tuber-server/.env.production.local')
text = path.read_text()
updates = {
    'APP_BASE_URL': 'http://${EC2Host}',
    'CLIENT_DOMAIN': 'http://${EC2Host}',
    'DOMAIN': 'http://${EC2Host}'
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
Write-Host "Your app should be accessible at http://${EC2Host}" -ForegroundColor Cyan
