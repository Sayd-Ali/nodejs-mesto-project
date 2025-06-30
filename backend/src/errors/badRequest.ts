import HTTP_STATUS from '../constants/httpStatus';

export default class BadRequestError extends Error {
  public statusCode = HTTP_STATUS.BAD_REQUEST;

  constructor(message = 'Некорректные данные') {
    super(message);
    this.name = 'BadRequestError';
  }
}
