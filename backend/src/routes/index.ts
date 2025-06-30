import { Router } from 'express';
import { login, createUser } from '../controllers/user';
import userRouter from './user';
import cardRouter from './card';
import { validateLogin, validateCreateUser } from '../middlewares/celebrateValidators';
import auth from '../middlewares/auth';

const router = Router();

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/cards', cardRouter);

export default router;
