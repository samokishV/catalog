import requestify = require('requestify');

import {logger} from '../../logger';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

/**
 * 
 * @param {number} page 
 * @param {string} params 
 * @return {object}
 */
export const findAll = (page: number, params: string) => {
  const url = `${apiBaseURL}/api/catalog${params}&page=${page}`;
  const method = 'GET';
  return requestify
  .request(url, { method: method })
  .then(response => response.getBody())
  .catch(
    (err) => {
      logger.debug(err);
      logger.error(`Error finding clothes: url ${url} method ${method} in Catalog.findAll`);
    },
  );
}