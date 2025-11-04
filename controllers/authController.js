import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

// token helpers
const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ email, password, verificationToken });

    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: 'Registration successful. Verification email sent.' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();
    res.json({ message: 'Email verified' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.verified) return res.status(403).json({ error: 'Email not verified' });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ error: 'Invalid token' });

    const newAccessToken = generateAccessToken(user._id);
    res.json({ accessToken: newAccessToken });
  } catch {
    res.status(403).json({ error: 'Token expired or invalid' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
    }
    res.json({ message: 'Logged out' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};