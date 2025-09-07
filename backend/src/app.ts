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

// доверять proxy (чтобы корректно работали secure cookies)
app.set('trust proxy', 1);

// Разрешаем фронту ходить на API
app.use(cors({
  origin: 'https://mymesto.student.nomorepartiessbs.ru',
  credentials: true, // обязательно для куки
}));

// JSON + cookies
app.use(express.json());
app.use(cookieParser());

// Логгер запросов
app.use(requestLogger);

// Основные роуты
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
