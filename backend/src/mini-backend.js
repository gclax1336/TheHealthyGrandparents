// Minimal Express backend with CORS and dummy auth endpoints
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 4000;

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Configure AWS SES via SMTP (guaranteed fix for SESv2 transport issues)
const transporter = nodemailer.createTransport({
  host: 'email-smtp.us-east-2.amazonaws.com',
  port: 465,
  secure: true, // true for port 465, false for 587
  auth: {
    user: process.env.SES_SMTP_USER, // set in environment
    pass: process.env.SES_SMTP_PASS  // set in environment
  }
});

app.use(express.json());

// Error handler for invalid JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Invalid JSON:', err.message);
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  next();
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/auth/register', (req, res) => {
  console.log('REGISTER EVENT:', JSON.stringify(req.body));
  res.json({ message: 'Registration successful! You can now log in.', data: req.body });
});

app.post('/api/auth/login', (req, res) => {
  console.log('LOGIN EVENT:', JSON.stringify(req.body));
  res.json({ message: 'Login endpoint hit!', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Mini backend running on port ${PORT}`);
}); 