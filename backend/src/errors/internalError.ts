import HTTP_STATUS from '../constants/httpStatus';

export default class InternalError extends Error {
  public statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;

  constructor(message = 'На сервере произошла ошибка') {
    super(message);
    this.name = 'InternalError';
  }
}
