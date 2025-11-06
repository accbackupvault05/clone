import { Router } from 'express';
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  changePassword
} from '@/controllers/authController';
import { authenticate } from '@/middleware/auth';
import { authRateLimiter } from '@/middleware/rateLimiter';
import { validateRegister, validateLogin, validateChangePassword } from '@/middleware/validation';

const router = Router();

// Public routes
router.post('/register', authRateLimiter, validateRegister, register);
router.post('/login', authRateLimiter, validateLogin, login);
router.post('/refresh', refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication
router.post('/logout', logout);
router.get('/me', getMe);
router.put('/change-password', validateChangePassword, changePassword);

export default router;