import { PORT, MONGO_URL } from './config';
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';
import { login, createUser } from './controllers/user';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './errors/default';
import auth from './middlewares/auth';
import { validateLogin, validateCreateUser } from './middlewares/celebrateValidators';

const app = express();
app.use(express.json());

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(auth);

app.use(requestLogger);

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use(errorLogger);

app.use(celebrateErrors());

app.use(errorHandler);

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
