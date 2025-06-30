import { Request, Response } from 'express';
import HTTP_STATUS from '../constants/httpStatus';

export default function handleError(
  err: { statusCode?: number; message: string },
  req: Request,
  res: Response,
) {
  const status = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  res.status(status).send({ message: err.message });
}
