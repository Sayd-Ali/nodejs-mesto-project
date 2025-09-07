import { PORT, MONGO_URL } from './config';
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './errors/default';
import cors from 'cors';

const app = express();

app.set('trust proxy', 1);

const corsOpts = {
  origin: 'https://mymesto.student.nomorepartiessbs.ru',
  credentials: true,
};
app.use(cors(corsOpts));

app.use(express.json());

app.use(requestLogger);

app.use(router);

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
