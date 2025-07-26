# Healthy Grandparent - Frontend Deployment Guide

## Overview
This guide explains how to deploy the new frontend files to the Healthy Grandparent server.

## Files Created
- `public/index.html` - Landing page with registration flow
- `public/verify-otp.html` - OTP verification page
- `public/payment.html` - Payment processing page
- `public/dashboard.html` - User dashboard
- `database/create_cms_tables.sql` - Database tables for workout content

## Deployment Steps

### 1. Database Setup
First, run the CMS database tables script:

```bash
# SSH to server
ssh -i thehealthygrandparent-key.pem ec2-user@3.17.67.234

# Navigate to backend directory
cd /home/ec2-user/backend

# Run the database script
mysql -u root -p healthy_grandparent < database/create_cms_tables.sql
```

### 2. Deploy Frontend Files
Copy the new frontend files to the server:

```bash
# From your local machine, copy files to server
scp -i thehealthygrandparent-key.pem backend/public/* ec2-user@3.17.67.234:/home/ec2-user/backend/public/

# Or manually upload the files via SFTP/SCP
```

### 3. Verify File Structure
On the server, verify the file structure:

```bash
# Check that files are in place
ls -la /home/ec2-user/backend/public/
```

Expected files:
- `index.html`
- `verify-otp.html`
- `payment.html`
- `dashboard.html`
- `admin-dashboard.html` (existing)

### 4. Test the Application
Test each page to ensure functionality:

```bash
# Test landing page
curl http://localhost:4001/index.html

# Test OTP verification page
curl http://localhost:4001/verify-otp.html

# Test payment page
curl http://localhost:4001/payment.html

# Test dashboard
curl http://localhost:4001/dashboard.html
```

### 5. Restart Server (if needed)
If the server needs to be restarted:

```bash
# Stop the current server
pkill -f 'node src/server.js'

# Start the server
cd /home/ec2-user/backend
node src/server.js &
```

## Testing the Complete Flow

### 1. Landing Page
- Visit: http://3.17.67.234:4001/index.html
- Test phone number input
- Verify OTP request functionality

### 2. OTP Verification
- Enter a test phone number
- Check SMS delivery
- Test OTP verification

### 3. Payment Flow
- Test Stripe integration
- Verify payment processing
- Check user profile updates

### 4. Dashboard
- Verify user authentication
- Test workout program display
- Check progress tracking

## API Endpoints Used

### Authentication
- `POST /api/auth/request-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Payment
- `POST /api/payment/create-intent` - Create payment intent
- `GET /api/payment/config` - Get Stripe config (needs to be added)

## Database Tables Created

### Core Tables
- `workout_programs` - Workout program information
- `exercises` - Individual exercise details
- `program_exercises` - Program-exercise relationships
- `user_progress` - User progress tracking
- `workout_sessions` - Individual workout sessions
- `session_exercises` - Exercises in each session
- `user_goals` - User fitness goals

### Sample Data
- 10 workout programs (Fall Prevention, Strength Building, etc.)
- 10 exercises (Standing Balance, Chair Squats, etc.)

## Security Considerations

### Frontend Security
- JWT token validation
- HTTPS enforcement (when SSL is configured)
- Input validation and sanitization
- XSS protection

### Payment Security
- Stripe PCI compliance
- Secure payment processing
- Webhook verification

## Monitoring and Maintenance

### Health Checks
- Monitor server status: `ps aux | grep 'node src/server.js'`
- Check database connectivity
- Monitor API response times

### Logs
- Server logs: Check console output
- Database logs: MySQL error logs
- Payment logs: Stripe dashboard

## Troubleshooting

### Common Issues

1. **Files not loading**
   - Check file permissions
   - Verify file paths
   - Check server logs

2. **Database connection issues**
   - Verify MySQL service status
   - Check database credentials
   - Test database connectivity

3. **Payment processing issues**
   - Verify Stripe keys
   - Check webhook configuration
   - Review payment logs

4. **SMS delivery issues**
   - Check Twilio account status
   - Verify phone number format
   - Review Twilio logs

### Debug Commands

```bash
# Check server status
ps aux | grep node

# Check server logs
tail -f /home/ec2-user/backend/server.log

# Test database connection
mysql -u root -p -e "USE healthy_grandparent; SHOW TABLES;"

# Check file permissions
ls -la /home/ec2-user/backend/public/

# Test API endpoints
curl -X POST http://localhost:4001/api/health
```

## Next Steps

### Immediate Tasks
1. Test complete user registration flow
2. Verify payment processing
3. Test dashboard functionality
4. Add Stripe config endpoint

### Future Enhancements
1. Implement workout interface
2. Add progress tracking
3. Create admin CMS interface
4. Add video content
5. Implement notifications

## Support

For technical issues:
- Check server logs
- Review API responses
- Test individual components
- Contact development team

For user support:
- Monitor admin dashboard
- Check user feedback
- Review usage analytics 