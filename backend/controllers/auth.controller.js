const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require('../services/email.service');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '7d' });

// POST /api/auth/signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success: false, message: 'Email already registered.' });
    const otp = generateOTP();
    const user = await User.create({
      name, email, password, age,
      otp: { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });
    try { await sendOTPEmail(email, otp, name); } catch (e) { console.warn('Email send failed:', e.message); }
    res.status(201).json({ success: true, message: 'Account created. Please verify your email.', userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/verify-otp
exports.verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.otp?.code || user.otp.code !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    user.isVerified = true;
    user.otp = undefined;
    await user.save();
    try { await sendWelcomeEmail(user.email, user.name); } catch {}
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Email verified successfully!', token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/resend-otp
exports.resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTPEmail(user.email, otp, user.name);
    res.json({ success: true, message: 'OTP resent successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials.' });
    if (!user.isVerified) return res.status(403).json({ success: false, message: 'Please verify your email first.', userId: user._id, needsVerification: true });
    user.lastActiveAt = new Date();
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, message: 'Login successful!', token, user: user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'No account found with this email.' });
    const otp = generateOTP();
    user.otp = { code: otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
    await user.save();
    await sendOTPEmail(email, otp, user.name);
    res.json({ success: true, message: 'Password reset OTP sent.', userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { userId, otp, newPassword } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (!user.otp?.code || user.otp.code !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    if (new Date() > user.otp.expiresAt) return res.status(400).json({ success: false, message: 'OTP expired.' });
    user.password = newPassword;
    user.otp = undefined;
    await user.save();
    res.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    res.json({ success: true, user: req.user.toPublicJSON() });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
