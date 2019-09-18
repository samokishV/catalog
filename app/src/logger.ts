import * as dotenv from 'dotenv';

const log4js = require('log4js');

dotenv.config({ path: '.env' });

log4js.configure({
  appenders: {
    production: { type: 'file', filename: '../app.log', level: 'error' },
    deb: { type: 'console', level: 'debug' },
    err: { type: 'console', level: 'error' },
  },
  categories: {
    default: { appenders: ['production'], level: 'error' },
    production: { appenders: ['production'], level: 'error' },
    development: { appenders: ['deb', 'err'], level: 'debug' },
  },
});

export const logger = log4js.getLogger(process.env.mode);
