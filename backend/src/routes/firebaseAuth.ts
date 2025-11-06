import { Router } from 'express';
import { verifyFirebaseToken } from '../middleware/firebaseAuth';
import {
  getUserProfile,
  updateUserProfile,
  deleteUserAccount,
  getUsers,
  checkUsername
} from '../controllers/firebaseAuthController';

const router = Router();

// Public routes
router.get('/check-username/:username', checkUsername);

// Protected routes (require Firebase authentication)
router.use(verifyFirebaseToken);

router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/account', deleteUserAccount);
router.get('/users', getUsers);

export default router;