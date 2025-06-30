import winston from 'winston';
import expressWinston from 'express-winston';
import path from 'path';
import 'winston-daily-rotate-file';

const jsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
);

export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, '../../logs'),
      level: 'info',
    }),
  ],
  format: jsonFormat,
  meta: true,
  msg: '{{req.method}} {{req.url}} {{res.statusCode}} – {{res.responseTime}}ms',
  expressFormat: false,
  colorize: false,
});

const transport = new winston.transports.DailyRotateFile({
  dirname: path.join(__dirname, '../../logs'),
  filename: 'error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxFiles: '14d',
  level: 'error',
});

export const errorLogger = expressWinston.errorLogger({
  transports: [transport],
  format: jsonFormat,
});
