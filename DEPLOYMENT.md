# 🚀 Deployment Guide for The Healthy Grandparent

## Overview
This guide will help you deploy your full-stack application to production with a custom domain.

## Prerequisites
1. A domain name (purchase from Namecheap, GoDaddy, Google Domains, etc.)
2. GitHub account
3. Vercel account (free)
4. Railway account (free) or similar backend hosting

## Step 1: Prepare Your Application

### Frontend (React) - Deploy to Vercel

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/thehealthygrandparent.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a React app
   - Deploy

3. **Configure Environment Variables in Vercel**
   - Go to your project settings
   - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.com`

### Backend (Express) - Deploy to Railway

1. **Prepare Backend for Railway**
   - Railway will automatically detect your Node.js app
   - Make sure your `package.json` has the start script (already added)

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Click "New Project"
   - Choose "Deploy from GitHub repo"
   - Select your repository
   - Railway will deploy the backend

3. **Configure Environment Variables in Railway**
   ```
   PORT=4000
   JWT_SECRET=your_secure_jwt_secret_here
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   FRONTEND_URL=https://yourdomain.com
   ```

## Step 2: Database Setup

### Option A: Railway MySQL (Recommended)
1. In Railway, add a MySQL database
2. Railway will provide connection details
3. Update your environment variables with the database credentials

### Option B: PlanetScale (Free tier available)
1. Go to [planetscale.com](https://planetscale.com)
2. Create a new database
3. Get connection details and update environment variables

## Step 3: Domain Configuration

### 1. Update CORS in Backend
Replace `yourdomain.com` in `backend/src/server.js` with your actual domain:
```javascript
const allowedOrigins = [
    'http://localhost:3000',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
];
```

### 2. Configure Domain in Vercel
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow Vercel's DNS configuration instructions

### 3. Configure Domain in Railway
1. Go to your Railway project
2. Click on your service
3. Go to "Settings" → "Domains"
4. Add your custom domain (e.g., `api.yourdomain.com`)

### 4. Update DNS Records
In your domain registrar's DNS settings, add:
- **A Record**: Point to Vercel's IP (Vercel will provide this)
- **CNAME Record**: `api.yourdomain.com` → `your-railway-app.railway.app`

## Step 4: Update Frontend API Calls

Update your frontend to use the production API URL. In your React components, replace:
```javascript
// Development
const API_URL = 'http://localhost:4000';

// Production
const API_URL = process.env.REACT_APP_API_URL || 'https://api.yourdomain.com';
```

## Step 5: Test Your Deployment

1. Visit your domain: `https://yourdomain.com`
2. Test user registration/login
3. Test all features
4. Check browser console for any errors

## Troubleshooting

### Common Issues:
1. **CORS Errors**: Make sure your domain is in the allowed origins
2. **Database Connection**: Verify environment variables are set correctly
3. **Build Errors**: Check Vercel build logs
4. **API 404**: Ensure Railway deployment is successful

### Environment Variables Checklist:
- [ ] `JWT_SECRET` (backend)
- [ ] `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (backend)
- [ ] `REACT_APP_API_URL` (frontend)
- [ ] `FRONTEND_URL` (backend)

## Cost Estimation
- **Vercel**: Free tier (Hobby plan)
- **Railway**: Free tier available
- **Domain**: ~$10-15/year
- **Database**: Free tier available

## Next Steps
1. Set up SSL certificates (automatic with Vercel/Railway)
2. Configure monitoring and logging
3. Set up CI/CD pipeline
4. Add analytics (Google Analytics, etc.)

Your application will be live at `https://yourdomain.com`! 🎉 