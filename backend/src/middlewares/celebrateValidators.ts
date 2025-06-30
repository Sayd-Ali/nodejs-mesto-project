import { celebrate, Joi, Segments } from 'celebrate';

const urlPattern = /^https?:\/\/[^\s]+$/;

export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.base': 'Имя должно быть строкой',
        'string.empty': 'Поле "name" не может быть пустым',
        'string.min': 'Имя должно быть не короче {#limit} символов',
        'string.max': 'Имя должно быть не длиннее {#limit} символов',
      }),
    about: Joi.string().min(2).max(30)
      .messages({
        'string.base': 'Поле "about" должно быть строкой',
        'string.min': 'Поле "about" не может быть короче {#limit} символов',
        'string.max': 'Поле "about" не может быть длиннее {#limit} символов',
      }),
    avatar: Joi.string().uri()
      .messages({
        'string.uri': 'Поле "avatar" должно быть корректной URL-ссылкой',
        'string.empty': 'Поле "avatar" не может быть пустым',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Неправильный формат email',
        'any.required': 'Поле "email" обязательно к заполнению',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Поле "password" не может быть пустым',
        'any.required': 'Поле "password" обязательно к заполнению',
      }),
  }),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.base': 'Email должен быть строкой',
        'string.empty': 'Поле "email" не может быть пустым',
        'string.email': 'Неверный формат email',
        'any.required': 'Поле "email" обязательно к заполнению',
      }),
    password: Joi.string().required()
      .messages({
        'string.base': 'Пароль должен быть строкой',
        'string.empty': 'Поле "password" не может быть пустым',
        'any.required': 'Поле "password" обязательно к заполнению',
      }),
  }),
});

export const validateUserId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().hex().length(24).required()
      .messages({
        'string.base': 'userId должен быть строкой',
        'string.hex': 'userId должен содержать только HEX-символы',
        'string.length': 'userId должен быть длиной {#limit} символов',
        'any.required': 'Параметр "userId" обязателен',
      }),
  }),
});

export const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.base': 'Имя должно быть строкой',
        'string.empty': 'Поле "name" не может быть пустым',
        'string.min': 'Имя должно быть не короче {#limit} символов',
        'string.max': 'Имя должно быть не длиннее {#limit} символов',
        'any.required': 'Поле "name" обязательно к заполнению',
      }),
    about: Joi.string().min(2).max(200).required()
      .messages({
        'string.base': 'Описание должно быть строкой',
        'string.empty': 'Поле "about" не может быть пустым',
        'string.min': 'Описание должно быть не короче {#limit} символов',
        'string.max': 'Описание должно быть не длиннее {#limit} символов',
        'any.required': 'Поле "about" обязательно к заполнению',
      }),
  }),
});

export const validateUpdateAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(urlPattern).required()
      .messages({
        'string.base': 'URL аватара должен быть строкой',
        'string.empty': 'Поле "avatar" не может быть пустым',
        'string.pattern.base': 'Поле "avatar" должно быть корректным URL',
        'any.required': 'Поле "avatar" обязательно к заполнению',
      }),
  }),
});

export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.base': 'Название карточки должно быть строкой',
        'string.empty': 'Поле "name" не может быть пустым',
        'string.min': 'Название должно быть не короче {#limit} символов',
        'string.max': 'Название должно быть не длиннее {#limit} символов',
        'any.required': 'Поле "name" обязательно к заполнению',
      }),
    link: Joi.string().pattern(urlPattern).required()
      .messages({
        'string.base': 'URL ссылки должен быть строкой',
        'string.empty': 'Поле "link" не может быть пустым',
        'string.pattern.base': 'Поле "link" должно быть корректным URL',
        'any.required': 'Поле "link" обязательно к заполнению',
      }),
  }),
});

export const validateCardId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().hex().length(24).required()
      .messages({
        'string.base': 'cardId должен быть строкой',
        'string.hex': 'cardId должен содержать только HEX-символы',
        'string.length': 'cardId должен быть длиной {#limit} символов',
        'any.required': 'Параметр "cardId" обязателен',
      }),
  }),
});
