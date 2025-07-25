#!/bin/bash

echo "🚀 Starting deployment process for The Healthy Grandparent..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
    echo "✅ Git repository initialized"
else
    echo "📁 Git repository already exists"
    git add .
    git commit -m "Update for deployment"
fi

echo ""
echo "📋 Next steps:"
echo "1. Create a GitHub repository at https://github.com/yourusername/thehealthygrandparent"
echo "2. Run: git remote add origin https://github.com/yourusername/thehealthygrandparent.git"
echo "3. Run: git push -u origin main"
echo ""
echo "🌐 Then deploy to:"
echo "- Frontend: https://vercel.com"
echo "- Backend: https://railway.app"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "🎯 Don't forget to:"
echo "- Purchase a domain name"
echo "- Update CORS settings with your domain"
echo "- Set up environment variables"
echo "- Configure database" 