import { PORT, MONGO_URL } from './config';
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './errors/default';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = ['https://mymesto.student.nomorepartiessbs.ru'];
const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins,
  credentials: true, // разрешаем куки/авторизацию
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

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
