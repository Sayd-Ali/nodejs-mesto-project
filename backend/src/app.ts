// src/app.ts
import express, {
  type RequestHandler,
} from 'express';
import mongoose from 'mongoose';
import { errors as celebrateErrors } from 'celebrate';

import { PORT, MONGO_URL } from './config';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './errors/default';

import cors, { type CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

// если стоим за nginx — нужно для корректной работы secure-кук
app.set('trust proxy', 1);

// ---------- CORS & cookies (ДО роутов) ----------
const allowedOrigins = ['https://mymesto.student.nomorepartiessbs.ru'];

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
// ответ на preflight через cors
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

// логирование запросов
app.use(requestLogger);

// Шорткат для preflight, чтобы не попасть в auth внутри роутера
const preflightHandler: RequestHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    // на всякий случай дублируем CORS-заголовки
    res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(204);
  }
  return next();
};
app.use(preflightHandler);

// ---------- Роутер ----------
// ВАЖНО: в самом router публичные /signup и /signin объяви ДО router.use(auth)
app.use(router);

// логирование ошибок
app.use(errorLogger);

// обработчики ошибок
app.use(celebrateErrors());
app.use(errorHandler);

// ---------- Старт ----------
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
