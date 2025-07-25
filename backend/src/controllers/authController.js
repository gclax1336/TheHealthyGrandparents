const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

exports.register = async (req, res) => {
  console.log('Register endpoint hit');
  const { email, password, firstName, lastName, phone, address, city, state, zipCode } = req.body;
  if (!email || !password) {
    console.log('Missing email or password');
    return res.status(400).json({ message: 'Email and password required' });
  }
  const existing = await userModel.findByEmail(email);
  if (existing) {
    console.log('Email already registered:', email);
    return res.status(400).json({ message: 'Email already registered' });
  }
  const verificationToken = crypto.randomBytes(32).toString('hex');
  await userModel.createUser(email, password, verificationToken, firstName, lastName, phone, address, city, state, zipCode);
  console.log('User created:', email);
  try {
    await sendEmail({
      to: email,
      subject: 'Verify your email',
      html: `<a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}">Verify Email</a>`
    });
    console.log('Email sent to:', email);
  } catch (err) {
    console.error('Error sending email:', err);
  }
  res.status(200).json({ message: 'Registration successful! Please check your email to verify your account.' });
};

exports.verify = async (req, res) => {
  const { token } = req.query;
  if (!token) return res.status(400).json({ message: 'Missing token' });
  const user = await userModel.findByVerificationToken(token);
  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });
  await userModel.setVerified(user.email);
  res.json({ message: 'Email verified! You can now log in.' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findByEmail(email);
  if (!user) return res.status(400).json({ message: 'Invalid email or password' });
  if (!user.is_verified) return res.status(403).json({ message: 'Please verify your email before logging in.' });
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(400).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.status(200).json({ token });
};

exports.me = async (req, res) => {
  res.status(200).json({ id: req.user.id, email: req.user.email });
};