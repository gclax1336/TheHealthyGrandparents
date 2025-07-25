const OTPAuth = require('otpauth');
const twilio = require('twilio');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

const twilioClient = twilio(accountSid, authToken);

// In-memory store for OTPs (for demo; use Redis or DB for production)
const otpStore = {};

exports.requestOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: 'Phone number required' });

  // Generate a 6-digit OTP
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  otpStore[phone] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // 5 min expiry

  try {
    await twilioClient.messages.create({
      body: `Your login code is: ${otp}`,
      from: twilioPhone,
      to: phone
    });
    res.json({ message: 'OTP sent' });
  } catch (err) {
    console.error('Twilio error:', err);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: 'Phone and OTP required' });
  
  const record = otpStore[phone];
  if (!record || record.otp !== otp || Date.now() > record.expires) {
    return res.status(400).json({ message: 'Invalid or expired OTP' });
  }
  
  // Optionally, create/find user in DB here
  let user = await userModel.findByPhone(phone);
  if (!user) {
    // Create a new user with this phone number
    await userModel.createUserWithPhone(phone);
    user = await userModel.findByPhone(phone);
  }
  
  // Issue JWT
  const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
  delete otpStore[phone]; // Remove OTP after use
  
  // Return user data and payment status
  res.json({ 
    token,
    has_paid: user.has_paid || false,
    user: {
      id: user.id,
      phone: user.phone
    }
  });
}; 