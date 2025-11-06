import { Router } from 'express';
import { authenticate } from '@/middleware/auth';
import { validateCreateStory, validatePagination } from '@/middleware/validation';
import { uploadRateLimiter } from '@/middleware/rateLimiter';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get stories feed
router.get('/feed', validatePagination, (req, res) => {
  res.json({ success: true, message: 'Get stories feed - Coming soon' });
});

// Get user stories
router.get('/user/:userId', validatePagination, (req, res) => {
  res.json({ success: true, message: 'Get user stories - Coming soon' });
});

// Create story
router.post('/create', uploadRateLimiter, validateCreateStory, (req, res) => {
  res.json({ success: true, message: 'Create story - Coming soon' });
});

// View story
router.put('/:storyId/view', (req, res) => {
  res.json({ success: true, message: 'View story - Coming soon' });
});

// Reply to story
router.post('/:storyId/reply', (req, res) => {
  res.json({ success: true, message: 'Reply to story - Coming soon' });
});

// Delete story
router.delete('/:storyId', (req, res) => {
  res.json({ success: true, message: 'Delete story - Coming soon' });
});

export default router;