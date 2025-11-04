import express from 'express';
import {
  register,
  login,
  verifyEmail,
  refresh,
  logout
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify/:token', verifyEmail);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', protect, logout);

export default router;