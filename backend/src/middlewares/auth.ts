import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';
import { JWT_SECRET } from '../config';

interface TokenPayload extends JwtPayload {
  _id: string;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  // Пропускаем preflight-запросы
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  const { authorization } = req.headers;
  const tokenFromCookie = req.cookies?.jwt;

  // Проверяем заголовок или куку
  if ((!authorization || !authorization.startsWith('Bearer ')) && !tokenFromCookie) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = tokenFromCookie || authorization!.replace('Bearer ', '');
  let payload: TokenPayload;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload | string;

    if (typeof decoded !== 'object' || decoded === null || !('_id' in decoded)) {
      throw new UnauthorizedError('Неверный токен');
    }

    payload = {
      _id: (decoded as any)._id,
      iat: (decoded as any).iat,
      exp: (decoded as any).exp,
    };
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = { _id: payload._id };
  return next();
}
