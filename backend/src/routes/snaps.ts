import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validateSendSnap, validatePagination } from '@/middleware/validation';
import { uploadRateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get received snaps
router.get('/received', validatePagination, (req, res) => {
  res.json({ success: true, message: 'Get received snaps - Coming soon' });
});

// Get sent snaps
router.get('/sent', validatePagination, (req, res) => {
  res.json({ success: true, message: 'Get sent snaps - Coming soon' });
});

// Send snap
router.post('/send', uploadRateLimiter, validateSendSnap, (req, res) => {
  res.json({ success: true, message: 'Send snap - Coming soon' });
});

// View snap
router.put('/:snapId/view', (req, res) => {
  res.json({ success: true, message: 'View snap - Coming soon' });
});

// Screenshot snap
router.put('/:snapId/screenshot', (req, res) => {
  res.json({ success: true, message: 'Screenshot snap - Coming soon' });
});

export default router;