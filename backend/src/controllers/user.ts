import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import BadRequestError from '../errors/badRequest';
import NotFoundError from '../errors/notFoundError';
import ConflictError from '../errors/ConflictError';
import UnauthorizedError from '../errors/UnauthorizedError';
import { JWT_SECRET } from '../config';
import HTTP_STATUS from '../constants/httpStatus';

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
      return;
    }

    res.status(HTTP_STATUS.OK).send(user);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильная почта или пароль'));
      return;
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      next(new UnauthorizedError('Неправильная почта или пароль'));
      return;
    }

    const token = jwt.sign(
      { _id: user._id },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    res
      .status(HTTP_STATUS.OK)
      .send({ token });
  } catch (err) {
    next(err);
  }
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id пользователя.'));
        return;
      }
      next(err);
    });
};

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(HTTP_STATUS.CREATED).send(user);
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя.'));
    }
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с таким email уже существует.'));
    }

    next(err);
  }
};

export const updateProfile = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, about } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля.'));
        return;
      }
      next(err);
    });
};

export const updateAvatar = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => {
      res.status(HTTP_STATUS.OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара.'));
        return;
      }
      next(err);
    });
};
