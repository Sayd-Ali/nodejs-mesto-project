import express, {Request, Response, NextFunction} from 'express';
import mongoose from 'mongoose';
import userRouter from './routes/user';
import cardRouter from './routes/card';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '6859869863dbe10c07f191f1' };
  next();
});


app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
});

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
