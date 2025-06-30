import HTTP_STATUS from '../constants/httpStatus';

export default class NotFoundError extends Error {
  public statusCode = HTTP_STATUS.NOT_FOUND;

  constructor(message = 'Ресурс не найден') {
    super(message);
    this.name = 'NotFoundError';
  }
}
