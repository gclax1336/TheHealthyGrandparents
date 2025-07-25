# deploy-backend.ps1 - Final Version

# This script assumes you have ALREADY created a key pair in the AWS console
# named 'thehealthygrandparent-key' and saved the .pem file in this directory.

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

try {
    # --- Script Parameters ---
    $awsPath = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"
    $region = "us-east-2"
    $keyName = "thehealthygrandparent-key" # MUST match the key you created in the console
    $securityGroupName = "thehealthygrandparent-backend-sg"
    $instanceName = "thehealthygrandparent-backend"
    $amiId = "resolve:ssm:/aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-x86_64"
    $instanceType = "t2.micro"
    $keyPath = "$PSScriptRoot\$keyName.pem"

    # --- Pre-run Check ---
    if (-not (Test-Path $keyPath)) {
        Write-Host "❌ ERROR: Key file not found at '$keyPath'." -ForegroundColor Red
        Write-Host "Please ensure you have created the key pair in the AWS Console and saved the .pem file in the script directory." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "🚀 Deploying The Healthy Grandparent Backend to AWS" -ForegroundColor Green
    Write-Host "==================================================" -ForegroundColor Green

    # --- Step 1: Create Security Group ---
    Write-Host "`n1️⃣  Creating Security Group..." -ForegroundColor Yellow
    $sg_id = & $awsPath ec2 create-security-group --group-name $securityGroupName --description "Security group for The Healthy Grandparent backend" --query 'GroupId' --output text --region $region
    Write-Host "✅ Security group '$securityGroupName' created with ID: $sg_id" -ForegroundColor Green

    Write-Host "Adding ingress rules..."
    & $awsPath ec2 authorize-security-group-ingress --group-id $sg_id --protocol tcp --port 22 --cidr 0.0.0.0/0 --region $region
    & $awsPath ec2 authorize-security-group-ingress --group-id $sg_id --protocol tcp --port 80 --cidr 0.0.0.0/0 --region $region
    & $awsPath ec2 authorize-security-group-ingress --group-id $sg_id --protocol tcp --port 443 --cidr 0.0.0.0/0 --region $region
    & $awsPath ec2 authorize-security-group-ingress --group-id $sg_id --protocol tcp --port 4000 --cidr 0.0.0.0/0 --region $region
    Write-Host "✅ Security group rules added." -ForegroundColor Green

    # --- Step 2: Launch EC2 Instance ---
    Write-Host "`n2️⃣  Launching EC2 Instance (using existing key)..." -ForegroundColor Yellow
    $instance_id = & $awsPath ec2 run-instances --image-id $amiId --count 1 --instance-type $instanceType --key-name $keyName --security-group-ids $sg_id --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$instanceName}]" --query 'Instances[0].InstanceId' --output text --region $region
    Write-Host "✅ Instance '$instanceName' launched with ID: $instance_id" -ForegroundColor Green

    Write-Host "⏳ Waiting for instance to be running..." -ForegroundColor Yellow
    & $awsPath ec2 wait instance-running --instance-ids $instance_id --region $region
    $publicIp = & $awsPath ec2 describe-instances --instance-ids $instance_id --query 'Reservations[0].Instances[0].PublicIpAddress' --output text --region $region
    Write-Host "✅ Instance is running at public IP: $publicIp" -ForegroundColor Green

    # --- Step 3: Deploy Backend Code ---
    Write-Host "`n3️⃣  Deploying Backend Code..." -ForegroundColor Yellow

    Write-Host "Setting permissions for local key file..."
    icacls.exe $keyPath /reset
    icacls.exe $keyPath /grant:r "$($env:username):(r)"
    icacls.exe $keyPath /inheritance:r

    Write-Host "Creating deployment package..."
    Compress-Archive -Path "backend" -DestinationPath "backend-deploy.zip" -Force

    Write-Host "Copying deployment package to instance (this may take a moment)..."
    scp -i $keyPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=nul ".\backend-deploy.zip" "ec2-user@$($publicIp):/home/ec2-user/"

    Write-Host "Installing dependencies and starting application on instance..."
    $sshCommand = "
        echo '--- Starting setup on instance ---';
        sudo yum update -y;
        echo 'Installing nvm (Node Version Manager)...';
        curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash;
        export NVM_DIR='/home/ec2-user/.nvm';
        [ -s '$NVM_DIR/nvm.sh' ] && \. '$NVM_DIR/nvm.sh';
        echo 'Installing Node.js v16...';
        nvm install 16;
        echo 'Installing pm2 process manager...';
        npm install -g pm2;
        echo 'Unzipping application code...';
        unzip -o /home/ec2-user/backend-deploy.zip -d /home/ec2-user/app;
        echo 'Installing application dependencies...';
        cd /home/ec2-user/app/backend && npm install;
        echo 'Starting application with pm2...';
        cd src;
        pm2 start server.js --name 'thehealthygrandparent-backend';
        echo 'Configuring pm2 to start on system reboot...';
        pm2 startup;
        echo '--- Setup complete ---';
    "
    ssh -i $keyPath -o StrictHostKeyChecking=no -o UserKnownHostsFile=nul "ec2-user@$($publicIp)" $sshCommand

    Remove-Item "backend-deploy.zip"

    Write-Host "`n✅ Backend deployment complete!" -ForegroundColor Green
    Write-Host "Your backend should be available at http://$publicIp:4000"
}
catch {
    Write-Host "`n❌ An error occurred during deployment:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}
