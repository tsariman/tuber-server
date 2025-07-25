# PowerShell EC2 Deployment Script for Full-Stack Tuber App
param(
    [string]$EC2Host = $env:EC2_HOST,
    [string]$EC2User = "ec2-user",
    [string]$KeyPath = $env:EC2_KEY_PATH
)

if (-not $EC2Host) {
    Write-Host "❌ Please set EC2_HOST environment variable or pass -EC2Host parameter" -ForegroundColor Red
    exit 1
}

if (-not $KeyPath) {
    Write-Host "❌ Please set EC2_KEY_PATH environment variable or pass -KeyPath parameter" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Starting deployment to EC2..." -ForegroundColor Green

# Create deployment archive
Write-Host "📦 Creating deployment package..." -ForegroundColor Yellow
tar -czf tuber-deployment.tar.gz --exclude='node_modules' --exclude='.git' --exclude='*.log' --exclude='.env*' .

# Upload files to EC2
Write-Host "📤 Uploading files to EC2..." -ForegroundColor Yellow
scp -i $KeyPath tuber-deployment.tar.gz "${EC2User}@${EC2Host}:/tmp/"

# Deploy on EC2
Write-Host "🔧 Setting up application on EC2..." -ForegroundColor Yellow
$deployScript = @"
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
"@

ssh -i $KeyPath "${EC2User}@${EC2Host}" $deployScript

# Clean up local files
Remove-Item tuber-deployment.tar.gz -ErrorAction SilentlyContinue

Write-Host "🎉 Deployment successful!" -ForegroundColor Green
Write-Host "Your app should be accessible at http://${EC2Host}" -ForegroundColor Cyan
