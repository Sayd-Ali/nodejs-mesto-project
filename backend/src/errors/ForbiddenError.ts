export default class ForbiddenError extends Error {
  public statusCode: number;

  constructor(message = 'Недостаточно прав') {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = 403;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
