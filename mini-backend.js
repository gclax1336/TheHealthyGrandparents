// Minimal Express backend with CORS and dummy auth endpoints
const express = require('express');
const nodemailer = require('nodemailer');
const { SESv2Client, SendEmailCommand } = require('@aws-sdk/client-sesv2');
// const cors = require('cors'); // REMOVE CORS

const app = express();
const PORT = 4000;

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://thehealthygrandparent.com',
//   'https://www.thehealthygrandparent.com'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) return callback(null, true);
//     return callback(new Error('Not allowed by CORS'));
//   },
//   credentials: true
// }));

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

app.post('/api/auth/register', async (req, res) => {
  console.log('Parsed request body:', req.body);
  const { email } = req.body;
  try {
    console.log('Would attempt to send welcome email to:', email);
    // await transporter.sendMail({
    //   from: 'noreply@thehealthygrandparent.com',
    //   to: email,
    //   subject: 'Welcome to The Healthy Grandparent!',
    //   html: `<h1>Welcome to The Healthy Grandparent!</h1><p>Thank you for registering. We're excited to have you as part of our community. You can now log in and start your journey to better health!</p>`
    // });
    // console.log('Welcome email sent to:', email);
    res.json({ message: 'Registration successful! (No email sent in test mode)', data: req.body });
  } catch (err) {
    console.error('Error sending welcome email:', err);
    res.status(500).json({ error: 'Registration succeeded but failed to send welcome email.' });
  }
  console.log('Register endpoint finished for:', email);
});

app.post('/api/auth/login', (req, res) => {
  console.log('Parsed request body:', req.body);
  res.json({ message: 'Login endpoint hit!', data: req.body });
});

app.listen(PORT, () => {
  console.log(`Mini backend running on port ${PORT}`);
}); 