#!/bin/bash

# EC2 User Data Script for Amazon Linux 2
# This script sets up Node.js, clones your repo, and starts the server

# Update system
yum update -y

# Install Docker
yum install -y docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/v2.21.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs

# Install pnpm
npm install -g pnpm

# Install git
yum install -y git

# Create app directory
mkdir -p /home/ec2-user/app
cd /home/ec2-user/app

# Clone your repository (you'll need to replace this with your actual repo)
# git clone https://github.com/crownlessking/tuber-server.git .

# For now, create a placeholder for manual upload
echo "Upload your application files to /home/ec2-user/app"
echo "Then run: pnpm install && pnpm build && pnpm start"

# Set ownership
chown -R ec2-user:ec2-user /home/ec2-user/app

# Install PM2 for process management
npm install -g pm2

echo "Setup complete. Upload your app files and run the application."
