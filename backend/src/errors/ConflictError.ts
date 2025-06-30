import HTTP_STATUS from '../constants/httpStatus';

export default class ConflictError extends Error {
  public statusCode: number;

  constructor(message = 'Conflict') {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = HTTP_STATUS.CONFLICT;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
