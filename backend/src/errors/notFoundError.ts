export default class NotFoundError extends Error {
  public statusCode = 404;

  constructor(message = 'Ресурс не найден') {
    super(message);
    this.name = 'NotFoundError';
  }
}
