import { Router } from 'express';
import {
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/user';
import {
  validateUserId,
  validateUpdateProfile,
  validateUpdateAvatar,
} from '../middlewares/celebrateValidators';

const router = Router();

router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatar);

export default router;
