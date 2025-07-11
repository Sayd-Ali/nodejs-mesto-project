import HTTP_STATUS from '../constants/httpStatus';

export default class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message = 'Authentication required') {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = HTTP_STATUS.UNAUTHORIZED;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
