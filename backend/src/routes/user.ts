import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
} from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

export default router;
