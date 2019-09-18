import {
  check, checkSchema, ParamSchema, ValidationChain,
} from 'express-validator';

import XRegExp = require('xregexp');

export const validate = [
  check('keyword')
    .matches(
      // @ts-ignore
      new XRegExp('^[\\pL 0-9]*$'),
    )
    .withMessage('Keyword must be alphanumeric, and can contain underscores'),
];
