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

// Phone number validation
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

exports.requestOtp = async (req, res) => {
  const { phone } = req.body;
  
  console.log(`[OTP Request] Received request for phone: ${phone}`);
  
  // Validate phone number
  if (!phone) {
    console.log('[OTP Request] Error: Phone number missing');
    return res.status(400).json({ message: 'Phone number required' });
  }
  
  if (!isValidPhoneNumber(phone)) {
    console.log(`[OTP Request] Error: Invalid phone number format: ${phone}`);
    return res.status(400).json({ message: 'Invalid phone number format. Use E.164 format (e.g., +15551234567)' });
  }

  // Generate a 6-digit OTP
  const otp = (Math.floor(100000 + Math.random() * 900000)).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 min expiry
  
  otpStore[phone] = { otp, expires: expiresAt };
  
  console.log(`[OTP Request] Generated OTP for ${phone}: ${otp} (expires: ${new Date(expiresAt).toISOString()})`);

  try {
    console.log(`[OTP Request] Attempting to send SMS via Twilio to ${phone}`);
    
    const message = await twilioClient.messages.create({
      body: `Your login code is: ${otp}`,
      from: twilioPhone,
      to: phone
    });
    
    console.log(`[OTP Request] SMS sent successfully! SID: ${message.sid}, Status: ${message.status}`);
    console.log(`[OTP Request] SMS sent to ${phone} with OTP: ${otp}`);
    
    res.json({ 
      message: 'OTP sent',
      success: true,
      timestamp: new Date().toISOString()
    });
    
  } catch (err) {
    console.error('[OTP Request] Twilio error:', err);
    console.error('[OTP Request] Error details:', {
      code: err.code,
      message: err.message,
      status: err.status,
      moreInfo: err.moreInfo
    });
    
    // Remove the OTP from store since sending failed
    delete otpStore[phone];
    
    // Provide specific error messages based on Twilio error codes
    let errorMessage = 'Failed to send OTP';
    if (err.code === 30032) {
      errorMessage = 'Phone number cannot receive SMS messages. Please check the number or try a different one.';
    } else if (err.code === 21211) {
      errorMessage = 'Invalid phone number format. Please use E.164 format (e.g., +15551234567).';
    } else if (err.code === 21608) {
      errorMessage = 'Toll-free number verification required. Please contact support.';
    }
    
    res.status(500).json({ 
      message: errorMessage,
      error: err.code,
      success: false
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;
  
  console.log(`[OTP Verify] Received verification request for phone: ${phone}`);
  
  if (!phone || !otp) {
    console.log('[OTP Verify] Error: Missing phone or OTP');
    return res.status(400).json({ message: 'Phone and OTP required' });
  }
  
  if (!isValidPhoneNumber(phone)) {
    console.log(`[OTP Verify] Error: Invalid phone number format: ${phone}`);
    return res.status(400).json({ message: 'Invalid phone number format' });
  }
  
  const record = otpStore[phone];
  
  if (!record) {
    console.log(`[OTP Verify] Error: No OTP found for ${phone}`);
    return res.status(400).json({ message: 'No OTP requested for this phone number' });
  }
  
  if (record.otp !== otp) {
    console.log(`[OTP Verify] Error: Invalid OTP for ${phone}. Expected: ${record.otp}, Received: ${otp}`);
    return res.status(400).json({ message: 'Invalid OTP' });
  }
  
  if (Date.now() > record.expires) {
    console.log(`[OTP Verify] Error: OTP expired for ${phone}`);
    delete otpStore[phone];
    return res.status(400).json({ message: 'OTP expired' });
  }
  
  console.log(`[OTP Verify] OTP verified successfully for ${phone}`);
  
  try {
    // Find or create user
    let user = await userModel.findByPhone(phone);
    if (!user) {
      console.log(`[OTP Verify] Creating new user for ${phone}`);
      await userModel.createUserWithPhone(phone);
      user = await userModel.findByPhone(phone);
    }
    
    // Issue JWT
    const token = jwt.sign({ id: user.id, phone: user.phone }, JWT_SECRET, { expiresIn: '7d' });
    delete otpStore[phone]; // Remove OTP after successful use
    
    console.log(`[OTP Verify] User authenticated successfully: ${user.id}`);
    
    res.json({ 
      token, 
      has_paid: !!user.has_paid,
      success: true,
      user_id: user.id
    });
    
  } catch (err) {
    console.error('[OTP Verify] Database error:', err);
    res.status(500).json({ message: 'Authentication failed', success: false });
  }
};

// Add a cleanup function to remove expired OTPs
exports.cleanupExpiredOtps = () => {
  const now = Date.now();
  let cleaned = 0;
  
  Object.keys(otpStore).forEach(phone => {
    if (otpStore[phone].expires < now) {
      delete otpStore[phone];
      cleaned++;
    }
  });
  
  if (cleaned > 0) {
    console.log(`[Cleanup] Removed ${cleaned} expired OTPs`);
  }
};

// Run cleanup every 10 minutes
setInterval(exports.cleanupExpiredOtps, 10 * 60 * 1000); 