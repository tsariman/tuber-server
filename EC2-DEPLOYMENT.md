# EC2 Full-Stack Deployment Guide

This guide will help you deploy your Tuber application (server + client) to AWS EC2.

## Prerequisites

1. **AWS EC2 Instance**: Launch an Amazon Linux 2 instance
2. **Security Group**: Allow inbound traffic on port 80 (HTTP)
3. **Key Pair**: Have your EC2 key pair (.pem file) ready
4. **Client Files**: Your transpiled client files are already in the `static/` folder

## Step 1: Prepare Your EC2 Instance

Launch your EC2 instance with the user data script we created:

```bash
# Use the ec2-user-data.sh script when launching your instance
# This will install Docker, Node.js, and other dependencies
```

## Step 2: Set Environment Variables

### On Windows (PowerShell):
```powershell
$env:EC2_HOST = "your-ec2-public-dns.amazonaws.com"
$env:EC2_KEY_PATH = "path\to\your\key.pem"
```

### On Linux/Mac:
```bash
export EC2_HOST="your-ec2-public-dns.amazonaws.com"
export EC2_KEY_PATH="/path/to/your/key.pem"
```

## Step 3: Ready to Deploy

Your client application is already transpiled and included in the `static/` folder, so no additional build step is needed.

## Step 4: Deploy

### Using PowerShell (Windows):
```powershell
.\deploy-ec2.ps1
```

### Using Bash (Linux/Mac):
```bash
chmod +x deploy-ec2.sh
./deploy-ec2.sh
```

## Step 5: Verify Deployment

1. Check if the application is running:
   ```bash
   ssh -i your-key.pem ec2-user@your-ec2-host "sudo docker ps"
   ```

2. Access your application:
   - Server API: `http://your-ec2-host/api/`
   - Client App: `http://your-ec2-host/`

## Troubleshooting

### Check Docker logs:
```bash
ssh -i your-key.pem ec2-user@your-ec2-host "sudo docker logs tuber-app"
```

### Restart the application:
```bash
ssh -i your-key.pem ec2-user@your-ec2-host "sudo docker restart tuber-app"
```

### Check if port 80 is accessible:
```bash
curl -I http://your-ec2-host
```

## Environment Variables

The application will automatically use the correct environment file based on `NODE_ENV`:

- **Development**: Uses `.env.app-config`
- **Production**: Uses `.env.production`

You can set additional environment variables by modifying the Docker run command in the deployment script:

```bash
sudo docker run -d \
    --name tuber-app \
    --restart unless-stopped \
    -p 80:8080 \
    -e NODE_ENV=production \
    -e JWT_SECRET="your-jwt-secret" \
    -e MONGODB_URI="your-mongodb-connection-string" \
    tuber-app
```

## Cost Optimization

- Use **t3.micro** or **t3.small** instances for small applications
- Consider using **Reserved Instances** for long-term deployments
- Set up **CloudWatch** alarms to monitor usage
- Use **Elastic IP** if you need a static IP address

## Security Considerations

1. **Security Groups**: Only allow necessary ports (80, 22)
2. **Key Management**: Keep your EC2 key pair secure
3. **Environment Variables**: Use AWS Secrets Manager for sensitive data
4. **SSL/TLS**: Consider setting up HTTPS with Let's Encrypt
5. **Updates**: Regularly update your EC2 instance and Docker images

## Next Steps

- Set up a domain name pointing to your EC2 instance
- Configure HTTPS with SSL certificates
- Set up monitoring and logging
- Implement automated backups
- Consider using AWS Application Load Balancer for high availability
