import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { sendVerificationEmail } from '../utils/sendEmail.js';

const generateAccessToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '15m' });
const generateRefreshToken = (id) => jwt.sign({ id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already in use' });

    const verificationToken = crypto.randomBytes(32).toString('hex');
    const user = await User.create({ email, password, verificationToken });

    await sendVerificationEmail(email, verificationToken);
    res.status(201).json({ message: 'Registration successful. Verification email sent.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ where: { verificationToken: req.params.token } });
    if (!user) return res.status(400).json({ error: 'Invalid or expired token' });

    user.verified = true;
    user.verificationToken = null;
    await user.save();
    
    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    if (!user.verified) return res.status(403).json({ error: 'Email not verified. Check your inbox.' });

    const accessToken = generateAccessToken(user.user_uuid);
    const refreshToken = generateRefreshToken(user.user_uuid);
    
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user: { email: user.email, id: user.user_uuid } });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

export const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ error: 'Refresh token required' });

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const user = await User.findByPk(decoded.id);
    
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }

    const newAccessToken = generateAccessToken(user.user_uuid);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: 'Token expired or invalid' });
  }
};

export const logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.user_uuid);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};