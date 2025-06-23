import { Request, Response } from 'express';

export default function handleError(
  err: { statusCode?: number; message: string },
  req: Request,
  res: Response,
) {
  const status = err.statusCode || 500;
  res.status(status).send({ message: err.message });
}
