import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/UnauthorizedError';
import { JWT_SECRET } from '../config';

interface TokenPayload extends JwtPayload {
  _id: string;
}

export default function auth(req: Request, res: Response, next: NextFunction) {
  // Пропускаем preflight без проверки
  if (req.method === 'OPTIONS') {
    return next();
  }

  const { authorization } = req.headers;
  const tokenFromCookie = req.cookies?.jwt;

  if ((!authorization || !authorization.startsWith('Bearer ')) && !tokenFromCookie) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = tokenFromCookie || authorization!.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    if (!decoded || typeof decoded !== 'object' || !decoded._id) {
      throw new UnauthorizedError('Неверный токен');
    }
    req.user = { _id: decoded._id as string };
    return next();
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
}
