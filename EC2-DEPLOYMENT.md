# AWS Free Tier — Full-Stack Deployment Guide

Deploy the Tuber app (server + client) on AWS **for free** using the AWS Free Tier.

## What You Get for Free

| Service | Free Tier Allowance | Duration |
|---------|-------------------|----------|
| **EC2 t2.micro or t3.micro** | 750 hrs/month — t2.micro in most regions, t3.micro where t2 is unavailable | 12 months |
| **EBS storage** | 30 GB general purpose SSD | 12 months |
| **Data transfer** | 100 GB outbound/month | 12 months |
| **MongoDB Atlas** (M0) | 512 MB shared cluster | Forever |
| **Elastic IP** | 1 free (while attached to running instance) | Always |

> **Tip:** After the 12-month free tier expires, look at Lightsail ($3.50/mo) or a t4g.micro (ARM, free indefinitely in always-free tier regions).

---

## Architecture

```
Browser  →  EC2 (t2.micro, port 80)
               ├── Fastify serves compiled React client at /
               ├── Fastify API routes at /signin, /bookmarks, /users, etc.
               └── Connects to MongoDB Atlas (free M0 cluster)
```

---

## Step 1: Create an AWS Account

1. Go to https://aws.amazon.com/free and sign up
2. You will need a credit card (only charged if you exceed free tier)
3. Select the **Basic (Free)** support plan

## Step 2: Set Up MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/atlas and create a free account
2. Create a **free M0 cluster** (512 MB, shared)
3. Under **Database Access**, create a database user with password
4. Under **Network Access**, add `0.0.0.0/0` (or your EC2 IP once known)
5. Click **Connect** → **Drivers** → copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```
6. Note the following for your `.env.production.local`:
   - `DB_REMOTE=true`
   - `DB_PROTOCOL=mongodb+srv://`
   - `DB_USERNAME=<your-atlas-user>`
   - `DB_PASSWORD=<your-atlas-password>`
   - `DB_HOST=cluster0.xxxxx.mongodb.net`
   - `DB_PORT=` (leave empty for Atlas)
   - `DB_NAME=<your-db-name>`
   - `DB_URI_QUERYSTRING=retryWrites=true&w=majority`

## Step 3: Launch an EC2 Instance

1. Go to **EC2 Dashboard** → **Launch Instance**
2. Settings:
   - **Name:** `tuber-app`
   - **AMI:** Amazon Linux 2023 (free tier eligible)
   - **Instance type:** `t2.micro` or `t3.micro` — the console will show whichever is free tier eligible in your region (look for the "Free tier eligible" label)
   - **Key pair:** Create or select one (download the `.pem` file)
   - **Security Group:** Create with these inbound rules:
     - SSH (port 22) — your IP only
     - HTTP (port 80) — `0.0.0.0/0`
     - HTTPS (port 443) — `0.0.0.0/0` (for future SSL)
   - **Storage:** 20 GB gp3 (within the 30 GB free tier)
3. Click **Launch Instance**
4. *(Optional)* Allocate an **Elastic IP** and associate it with your instance (free while attached)

## Step 4: Connect to Your Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ec2-user@<your-ec2-public-ip>
```

Or on Windows PowerShell:
```powershell
ssh -i your-key.pem ec2-user@<your-ec2-public-ip>
```

## Step 5: Install Docker on EC2

The `ec2-user-data.sh` script handles this automatically if set as user data.
Otherwise, run manually:

```bash
sudo yum update -y
sudo yum install -y docker git
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user
# Log out and back in for group change to take effect
exit
```

## Step 6: Create Production Environment File

On EC2, create the env file:

```bash
sudo mkdir -p /opt/tuber-app/tuber-server
sudo nano /opt/tuber-app/tuber-server/.env.production.local
```

Required variables:

```env
NODE_ENV=production
DOMAIN=<your-ec2-public-ip>
CLIENT_DOMAIN=http://<your-ec2-public-ip>

# MongoDB Atlas
DB_REMOTE=true
DB_PROTOCOL=mongodb+srv://
DB_NAME=tuber
DB_USERNAME=<atlas-user>
DB_PASSWORD=<atlas-password>
DB_HOST=cluster0.xxxxx.mongodb.net
DB_PORT=
DB_URI_QUERYSTRING=retryWrites=true&w=majority

# JWT (generate a strong secret)
JWT_SECRET=<your-random-secret>
COOKIE_SECRET=<your-random-cookie-secret>

# Port
FASTIFY_PORT=8080
```

## Step 7: Deploy

### Option A: Automated (from your local machine)

Set your environment variables:

**PowerShell:**
```powershell
$env:EC2_HOST = "<your-ec2-public-ip>"
$env:EC2_KEY_PATH = "C:\path\to\your-key.pem"
.\tuber-server\deploy-ec2.ps1
```

**Bash:**
```bash
export EC2_HOST="<your-ec2-public-ip>"
export EC2_KEY_PATH="/path/to/your-key.pem"
bash tuber-server/deploy-ec2.sh
```

The deploy script will:
1. Package `tuber-server`, `tuber-client`, and `tuber-shared`
2. Upload to EC2
3. Build a Docker image (multi-stage: compiles client + server)
4. Run the container on port 80

### Option B: Manual (on EC2)

```bash
cd /opt/tuber-app
# Upload or git clone your three project directories here
sudo docker build -f tuber-server/Dockerfile -t tuber-app .
sudo docker run -d \
    --name tuber-app \
    --restart unless-stopped \
    -p 80:8080 \
    --env-file /opt/tuber-app/tuber-server/.env.production.local \
    tuber-app
```

## Step 8: Verify

```bash
# Check container is running
sudo docker ps

# Check logs
sudo docker logs tuber-app

# Test from your browser
# http://<your-ec2-public-ip>/
```

---

## Troubleshooting

### Check Docker logs:
```bash
ssh -i your-key.pem ec2-user@<your-ec2-ip> "sudo docker logs tuber-app --tail 50"
```

### Restart the application:
```bash
ssh -i your-key.pem ec2-user@<your-ec2-ip> "sudo docker restart tuber-app"
```

### Rebuild after code changes:
```bash
sudo docker stop tuber-app && sudo docker rm tuber-app
sudo docker build -f tuber-server/Dockerfile -t tuber-app .
sudo docker run -d --name tuber-app --restart unless-stopped -p 80:8080 \
    --env-file /opt/tuber-app/tuber-server/.env.production.local tuber-app
```

### MongoDB Atlas connection issues:
- Verify your EC2 IP is whitelisted in Atlas **Network Access**
- Check credentials in `.env.production.local`
- Test with: `sudo docker exec tuber-app node -e "require('mongoose').connect(process.env.DB_URI)"`

---

## Staying Free: Checklist

- [ ] Use **t2.micro or t3.micro** — pick whichever is marked "Free tier eligible" in your region
- [ ] Keep EBS volume under **30 GB**
- [ ] Use **one Elastic IP** attached to your running instance
- [ ] Use **MongoDB Atlas M0** (free forever, 512 MB)
- [ ] Monitor usage in **AWS Billing Dashboard** → set a billing alarm at $1
- [ ] Stop the instance when not in use (stops compute charges, EBS still counts)

## Next Steps

- Register a domain name and point it to your Elastic IP
- Set up HTTPS with Let's Encrypt (free SSL): `sudo certbot --standalone`
- Add a billing alarm in CloudWatch to alert you before any charges
- Consider using AWS Application Load Balancer for high availability
