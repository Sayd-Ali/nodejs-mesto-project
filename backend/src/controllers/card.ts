import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import BadRequestError from '../errors/badRequest';
import NotFoundError from '../errors/notFoundError';
import HTTP_STATUS from '../constants/httpStatus';

export const createCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(HTTP_STATUS.CREATED).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
        return;
      }
      next(err);
    });
};

export const getCards = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  Card.find({})
    .then((cards) => {
      res.status(HTTP_STATUS.OK).send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

export const deleteCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  try {
    const card = await Card.findOneAndDelete({ _id: cardId, owner: userId });
    if (!card) {
      next(new NotFoundError('Карточка не найдена или удалена ранее'));
      return;
    }
    res.status(HTTP_STATUS.OK).send(card);
  } catch (err: any) {
    if (err.name === 'CastError') {
      next(new BadRequestError('Неверный формат _id карточки'));
      return;
    }
    next(err);
  }
};

export const likeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(HTTP_STATUS.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
        return;
      }
      next(err);
    });
};

export const unlikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => {
      res.status(HTTP_STATUS.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Передан некорректный _id карточки.'));
        return;
      }
      next(err);
    });
};
