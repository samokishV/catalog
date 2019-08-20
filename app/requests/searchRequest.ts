import {
  check, checkSchema, ParamSchema, ValidationChain,
} from 'express-validator';

const XRegExp = require('xregexp');

export const search = [
  check('keyword')
    .matches(new XRegExp('^[\\pL 0-9]*$'))
    .withMessage('Keyword must be alphanumeric, and can contain underscores'),
];
