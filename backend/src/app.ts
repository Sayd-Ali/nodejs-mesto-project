import { PORT, MONGO_URL } from './config';
import { errors as celebrateErrors } from 'celebrate';
import express from 'express';
import mongoose from 'mongoose';
import router from './routes';
import { requestLogger, errorLogger } from './middlewares/logger';
import errorHandler from './errors/default';
import cors from 'cors';

const app = express();

const allowed = [
  /^https?:\/\/mymesto\.student\.nomorepartiessbs\.ru$/,
  /^http:\/\/localhost:(3000|3001)$/
];

const corsOpts: cors.CorsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);

    const ok = allowed.some((re) => re.test(origin));
    if (ok) return cb(null, true);

    console.warn('CORS blocked origin:', origin);
    return cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PATCH','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Origin','Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOpts));

app.use(express.json());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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
