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

// доверять proxy (чтобы корректно работали secure cookies за nginx)
app.set('trust proxy', 1);

// --- CORS (разрешаем фронту ходить на API с куками) ---
const corsOpts = {
  origin: 'https://mymesto.student.nomorepartiessbs.ru',
  credentials: true,
};
app.use(cors(corsOpts));
app.options('*', cors(corsOpts)); // preflight через cors

// ⚠️ Шорткат: съедаем OPTIONS до роутов, чтобы не попало в auth
const preflight = (req: any, res: any, next: any) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
};
app.use(preflight);

// JSON + cookies
app.use(express.json());
app.use(cookieParser());

// Логгер запросов
app.use(requestLogger);

// Роуты (внутри router публичные /signin и /signup должны идти ДО router.use(auth))
app.use(router);

// Логгер ошибок
app.use(errorLogger);

// Ошибки celebrate
app.use(celebrateErrors());

// Общий обработчик ошибок
app.use(errorHandler);

// Подключение к Mongo и запуск сервера
mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
