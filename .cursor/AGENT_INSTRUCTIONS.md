# AGENT AUTONOMOUS DEVELOPMENT INSTRUCTIONS

## PROJECT CONTEXT
You are working on the Healthy Grandparent platform - a fitness app for elderly people focused on fall prevention and maintaining independence.

## CURRENT STATUS
- ✅ Backend API complete (Express.js, MySQL, JWT auth, Twilio SMS, Stripe payments)
- ✅ Admin dashboard deployed at http://3.17.67.234:4001/admin-dashboard.html
- ✅ Existing website at thehealthygrandparent.com with daily workout content
- ❌ Missing: Integration between existing frontend and backend API, user registration flow, payment integration

## EXISTING WEBSITE ANALYSIS
The current thehealthygrandparent.com website includes:
- Professional design with "The Healthy Grandparent" branding
- Navigation: Home, About Us, Login, Sign Up
- Daily workout content (e.g., "Joint Pain & Arthritis - Day 3: Range of Motion")
- User dashboard with workout of the day
- Tagline: "Supporting Grandparents in their health journey through physical activity"

## IMMEDIATE TASKS TO COMPLETE

### 1. INTEGRATE BACKEND API WITH EXISTING FRONTEND
**Priority**: CRITICAL
**Requirements**:
- Connect existing thehealthygrandparent.com to backend API at 3.17.67.234:4001
- Add user registration flow to existing site
- Integrate OTP authentication with existing login system
- Add payment processing to existing user flow
- Maintain existing design and branding

### 2. ENHANCE EXISTING USER FLOW
**Files to modify**: Existing thehealthygrandparent.com pages
**Requirements**:
- Add phone number registration to existing signup process
- Integrate OTP verification with existing login
- Add payment processing for subscription access
- Connect user dashboard to backend user data
- Maintain existing workout content and daily features

### 3. CONNECT EXISTING CONTENT TO BACKEND
**Requirements**:
- Link existing workout programs to backend database
- Add user progress tracking to existing dashboard
- Integrate existing daily workout system with user accounts
- Add admin content management for existing workout content

### 4. ENHANCE EXISTING FEATURES
**Focus Areas**:
- Add user authentication to existing workout access
- Integrate payment processing for premium content
- Add progress tracking to existing workout system
- Enhance existing daily workout features with user personalization

## DEVELOPMENT GUIDELINES

### Code Standards
- Preserve existing design and branding
- Integrate new features seamlessly with existing UI
- Maintain elderly-friendly design principles
- Add error handling to all functions
- Include console logging for debugging
- Test API endpoints before deployment

### Integration Approach
- Work with existing thehealthygrandparent.com codebase
- Add backend API integration to existing frontend
- Preserve existing user experience and content
- Enhance rather than replace existing functionality

### Database Management
- Use existing CMS tables we created
- Connect existing workout content to database
- Add proper indexes for performance
- Test query performance

### Deployment Process
1. Test changes locally first
2. SSH to server: `ssh -i thehealthygrandparent-key.pem ec2-user@3.17.67.234`
3. Navigate to: `cd /home/ec2-user/backend`
4. Deploy files to appropriate directories
5. Restart server: `pkill -f 'node src/server.js' && node src/server.js &`
6. Test functionality on thehealthygrandparent.com

### File Structure
```
/home/ec2-user/backend/
├── src/ (existing backend)
├── public/ (existing frontend files)
│   ├── index.html (existing landing page)
│   ├── verify-otp.html (OTP verification - add to existing)
│   ├── payment.html (payment processing - add to existing)
│   ├── dashboard.html (enhance existing dashboard)
│   └── admin-dashboard.html (existing admin)
└── database/ (CMS tables)
```

## PRIORITY ORDER
1. **Connect existing frontend to backend API** - Critical integration
2. **Add user registration to existing signup** - User flow enhancement
3. **Integrate payment processing** - Revenue generation
4. **Enhance existing dashboard** - User experience improvement
5. **Connect existing content to database** - Content management

## STOP AND WAIT FOR USER INPUT WHEN:
- Payment processing issues
- Security vulnerabilities
- Major architectural decisions
- Legal/compliance questions
- User feedback requiring business decisions
- Changes that would break existing functionality

## CONTINUE AUTONOMOUSLY FOR:
- API integration with existing frontend
- UI/UX improvements that preserve existing design
- Content creation and enhancement
- Bug fixes
- Feature enhancements
- Documentation updates

## SUCCESS CRITERIA
- Existing thehealthygrandparent.com works with backend API
- Users can register and login through existing site
- Users can access existing workout content with authentication
- Payment processing works for premium content
- Admin can manage existing content
- Platform maintains existing design and user experience

## ACCESS INFORMATION
- **Server**: SSH via `thehealthygrandparent-key.pem` to `ec2-user@3.17.67.234`
- **Admin Dashboard**: http://3.17.67.234:4001/admin-dashboard.html
- **Admin Login**: Phone: +12676149002, OTP: 123456
- **Database**: MySQL on localhost
- **API Base**: http://3.17.67.234:4001/api/
- **Existing Website**: thehealthygrandparent.com

## INTEGRATION NOTES
- Preserve existing "The Healthy Grandparent" branding
- Maintain existing navigation and user flow
- Keep existing daily workout content and features
- Add backend functionality without disrupting existing experience
- Ensure seamless integration between existing frontend and new backend

## START WITH:
Connect the existing thehealthygrandparent.com frontend to the backend API and add user registration/payment flow while preserving the existing design and content. 