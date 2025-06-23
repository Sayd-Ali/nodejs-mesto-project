export default class InternalError extends Error {
  public statusCode = 500;

  constructor(message = 'На сервере произошла ошибка') {
    super(message);
    this.name = 'InternalError';
  }
}
