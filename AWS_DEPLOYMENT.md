# 🚀 AWS Deployment Guide for The Healthy Grandparent

## Overview
This guide will help you deploy your full-stack application to AWS using:
- **Frontend**: AWS S3 + CloudFront (Static Website Hosting)
- **Backend**: AWS EC2 (Node.js Server)
- **Database**: AWS RDS (MySQL)
- **Domain**: AWS Route 53
- **SSL**: AWS Certificate Manager

## Prerequisites
1. AWS Account (free tier available)
2. Domain name (can purchase through Route 53)
3. Basic knowledge of AWS services
4. SSH key pair for EC2

## Step 1: AWS Account Setup

### 1.1 Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the signup process
4. **Important**: Set up billing alerts to avoid unexpected charges

### 1.2 Install AWS CLI
```bash
# Windows (PowerShell)
winget install -e --id Amazon.AWSCLI

# Or download from: https://aws.amazon.com/cli/
```

### 1.3 Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Enter your default region (e.g., us-east-1)
# Enter your output format (json)
```

## Step 2: Database Setup (RDS)

### 2.1 Create RDS MySQL Instance
1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "Standard create"
4. Select "MySQL"
5. Choose "Free tier" (if eligible)
6. Configure:
   - **DB instance identifier**: `thehealthygrandparent-db`
   - **Master username**: `admin`
   - **Master password**: `YourSecurePassword123!`
   - **DB instance class**: `db.t3.micro` (free tier)
   - **Storage**: 20 GB
   - **Multi-AZ deployment**: No (for cost savings)
7. Click "Create database"

### 2.2 Configure Security Group
1. Go to EC2 → Security Groups
2. Find the RDS security group
3. Edit inbound rules
4. Add rule:
   - Type: MySQL/Aurora
   - Port: 3306
   - Source: Custom (your EC2 security group)

## Step 3: Backend Deployment (EC2)

### 3.1 Create EC2 Instance
1. Go to EC2 Console
2. Click "Launch Instance"
3. Configure:
   - **Name**: `thehealthygrandparent-backend`
   - **AMI**: Amazon Linux 2023
   - **Instance type**: t2.micro (free tier)
   - **Key pair**: Create new or select existing
   - **Security group**: Create new
     - SSH (22) from My IP
     - HTTP (80) from Anywhere
     - HTTPS (443) from Anywhere
     - Custom TCP (4000) from Anywhere
4. Launch instance

### 3.2 Connect to EC2
```bash
# Download your .pem key file
# Connect via SSH
ssh -i "your-key.pem" ec2-user@your-ec2-public-ip
```

### 3.3 Install Node.js and Dependencies
```bash
# Update system
sudo yum update -y

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo yum install -y git

# Verify installations
node --version
npm --version
```

### 3.4 Deploy Backend Code
```bash
# Clone your repository
git clone https://github.com/yourusername/thehealthygrandparent.git
cd thehealthygrandparent/backend

# Install dependencies
npm install

# Create environment file
sudo nano .env
```

### 3.5 Configure Environment Variables
Add to `.env`:
```env
NODE_ENV=production
PORT=4000
JWT_SECRET=your_super_secure_jwt_secret_here
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=YourSecurePassword123!
DB_NAME=thehealthygrandparent
DB_PORT=3306
FRONTEND_URL=https://yourdomain.com
```

### 3.6 Start Backend with PM2
```bash
# Start the application
pm2 start src/server.js --name "thehealthygrandparent-backend"

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided

# Check status
pm2 status
pm2 logs thehealthygrandparent-backend
```

## Step 4: Frontend Deployment (S3 + CloudFront)

### 4.1 Build Frontend
```bash
# On your local machine
npm run build
```

### 4.2 Create S3 Bucket
1. Go to S3 Console
2. Click "Create bucket"
3. Configure:
   - **Bucket name**: `thehealthygrandparent-frontend`
   - **Region**: Same as your EC2 instance
   - **Block all public access**: Uncheck (for static website hosting)
4. Click "Create bucket"

### 4.3 Configure S3 for Static Website Hosting
1. Select your bucket
2. Go to "Properties"
3. Scroll to "Static website hosting"
4. Click "Edit"
5. Enable static website hosting
6. Set index document: `index.html`
7. Set error document: `index.html`
8. Save changes

### 4.4 Upload Frontend Files
```bash
# Install AWS CLI if not already installed
aws s3 sync build/ s3://thehealthygrandparent-frontend --delete
```

### 4.5 Create CloudFront Distribution
1. Go to CloudFront Console
2. Click "Create Distribution"
3. Configure:
   - **Origin domain**: Your S3 bucket website endpoint
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Default root object**: index.html
   - **Error pages**: Create custom error response
     - HTTP error code: 403
     - Response page path: /index.html
     - Response code: 200
4. Create distribution

## Step 5: Domain and SSL Setup

### 5.1 Purchase Domain (if needed)
1. Go to Route 53 Console
2. Click "Registered domains"
3. Click "Register Domain"
4. Choose your domain name
5. Complete registration

### 5.2 Request SSL Certificate
1. Go to Certificate Manager
2. Click "Request certificate"
3. Add domain names:
   - `yourdomain.com`
   - `*.yourdomain.com`
4. Choose DNS validation
5. Request certificate

### 5.3 Configure Route 53
1. Go to Route 53 → Hosted zones
2. Select your domain
3. Create records:
   - **A Record**: Point to CloudFront distribution
   - **CNAME Record**: `api.yourdomain.com` → Your EC2 public IP

### 5.4 Update CloudFront
1. Go to your CloudFront distribution
2. Add alternate domain names:
   - `yourdomain.com`
   - `www.yourdomain.com`
3. Select your SSL certificate
4. Update distribution

## Step 6: Environment Configuration

### 6.1 Update Frontend Environment
Create `.env.production` in your frontend:
```env
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_FRONTEND_URL=https://yourdomain.com
```

### 6.2 Update Backend CORS
Update `backend/src/server.js`:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];
```

### 6.3 Rebuild and Deploy
```bash
# Rebuild frontend
npm run build

# Upload to S3
aws s3 sync build/ s3://thehealthygrandparent-frontend --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"

# Restart backend
pm2 restart thehealthygrandparent-backend
```

## Step 7: Monitoring and Maintenance

### 7.1 Set Up CloudWatch
1. Go to CloudWatch Console
2. Set up basic monitoring for EC2
3. Create alarms for:
   - CPU utilization
   - Memory usage
   - Disk space

### 7.2 Set Up Logging
```bash
# View PM2 logs
pm2 logs thehealthygrandparent-backend

# View system logs
sudo tail -f /var/log/messages
```

### 7.3 Backup Strategy
1. Enable automated backups for RDS
2. Set up S3 lifecycle policies
3. Regular database exports

## Cost Estimation (Monthly)
- **EC2 t2.micro**: $0 (free tier) / $8.47 (after free tier)
- **RDS t3.micro**: $0 (free tier) / $15.33 (after free tier)
- **S3**: ~$0.50 (for small website)
- **CloudFront**: ~$0.50 (for small traffic)
- **Route 53**: $0.50 (hosted zone) + domain cost
- **Certificate Manager**: Free
- **Total**: ~$1-2/month (free tier) / ~$25/month (after free tier)

## Troubleshooting

### Common Issues:
1. **EC2 Connection**: Check security groups and key pair
2. **Database Connection**: Verify RDS security group and credentials
3. **CORS Errors**: Check allowed origins in backend
4. **SSL Issues**: Verify certificate validation
5. **CloudFront Cache**: Invalidate cache after updates

### Useful Commands:
```bash
# Check EC2 status
pm2 status
pm2 logs

# Check database connection
mysql -h your-rds-endpoint -u admin -p

# Check S3 sync
aws s3 ls s3://thehealthygrandparent-frontend

# Check CloudFront status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

## Next Steps
1. Set up CI/CD pipeline with AWS CodePipeline
2. Configure auto-scaling for EC2
3. Set up monitoring and alerting
4. Implement backup and disaster recovery
5. Add CDN caching strategies

Your application will be live at `https://yourdomain.com`! 🎉 