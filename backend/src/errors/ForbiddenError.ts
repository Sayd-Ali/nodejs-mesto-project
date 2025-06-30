import HTTP_STATUS from '../constants/httpStatus';

export default class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = HTTP_STATUS.FORBIDDEN;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
