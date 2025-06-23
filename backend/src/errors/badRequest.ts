export default class BadRequestError extends Error {
  public statusCode = 400;

  constructor(message = 'Некорректные данные') {
    super(message);
    this.name = 'BadRequestError';
  }
}
