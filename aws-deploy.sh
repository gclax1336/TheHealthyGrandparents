#!/bin/bash

echo "🚀 AWS Deployment Script for The Healthy Grandparent"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    echo "Download from: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not configured. Please run 'aws configure' first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ AWS CLI is configured${NC}"

# Variables
PROJECT_NAME="thehealthygrandparent"
REGION="us-east-1"
BUCKET_NAME="${PROJECT_NAME}-frontend-$(date +%s)"

echo ""
echo "📋 Configuration:"
echo "Project: $PROJECT_NAME"
echo "Region: $REGION"
echo "S3 Bucket: $BUCKET_NAME"
echo ""

# Step 1: Build the frontend
echo "🔨 Building frontend..."
if npm run build; then
    echo -e "${GREEN}✅ Frontend built successfully${NC}"
else
    echo -e "${RED}❌ Frontend build failed${NC}"
    exit 1
fi

# Step 2: Create S3 bucket
echo ""
echo "🪣 Creating S3 bucket..."
if aws s3 mb s3://$BUCKET_NAME --region $REGION; then
    echo -e "${GREEN}✅ S3 bucket created: $BUCKET_NAME${NC}"
else
    echo -e "${RED}❌ Failed to create S3 bucket${NC}"
    exit 1
fi

# Step 3: Configure S3 for static website hosting
echo ""
echo "🌐 Configuring S3 for static website hosting..."
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Step 4: Upload files to S3
echo ""
echo "📤 Uploading files to S3..."
if aws s3 sync build/ s3://$BUCKET_NAME --delete; then
    echo -e "${GREEN}✅ Files uploaded successfully${NC}"
else
    echo -e "${RED}❌ Failed to upload files${NC}"
    exit 1
fi

# Step 5: Make bucket public
echo ""
echo "🔓 Making bucket public..."
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy '{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "PublicReadGetObject",
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::'$BUCKET_NAME'/*"
        }
    ]
}'

echo ""
echo -e "${GREEN}🎉 Frontend deployment completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Create CloudFront distribution pointing to:"
echo "   http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com"
echo ""
echo "2. Set up your EC2 instance for the backend:"
echo "   - Launch EC2 instance (t2.micro for free tier)"
echo "   - Install Node.js and PM2"
echo "   - Deploy backend code"
echo ""
echo "3. Configure Route 53 for your domain"
echo ""
echo "4. Set up SSL certificate in Certificate Manager"
echo ""
echo "📖 See AWS_DEPLOYMENT.md for detailed instructions"
echo ""
echo "🌐 Your S3 website URL:"
echo "http://$BUCKET_NAME.s3-website-$REGION.amazonaws.com" 