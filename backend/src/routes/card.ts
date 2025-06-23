import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', unlikeCard);

export default router;
