import {
    check, checkSchema, ParamSchema, ValidationChain,
  } from 'express-validator';
  
  const XRegExp = require('xregexp');
  
  export const validate = [
    check('keyword')
      .matches(new XRegExp('^[\\pL 0-9]*$'))
      .withMessage('Keyword must be alphanumeric, and can contain underscores'),
    check('brand')
      .matches(new XRegExp('^[\\pL 0-9 \\- \\,]*$'))
      .withMessage('Brand must be alphanumeric, and can contain underscores'),
    check('size')
      .matches(new XRegExp('^([3][5-9]|[4][0-5]|[SML])*$'))
      .withMessage('Size must be in range 35-45 for shoes or S/M/L for dress'),  
    check('sort')
      .matches(new XRegExp('^((name\-(asc|desc))|default)*$'))
      .withMessage('Sort must be default, name-asc or name-desc'),
    check('page')
      .matches('^([1-9][0-9]*)*$')
      .withMessage('Page must be numeric and start from 1'),        
  ];