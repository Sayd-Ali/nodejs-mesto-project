import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import BadRequestError from '../errors/badRequest';
import NotFoundError from '../errors/notFoundError';

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      return next(err);
    });
};

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

export const deleteCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;

  Card.findByIdAndDelete(cardId)
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки.'));
      }
      return next(err);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки.'));
      }
      return next(err);
    });
};

export const unlikeCard = (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Передан некорректный _id карточки.'));
      }
      return next(err);
    });
};
