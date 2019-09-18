import * as dotenv from 'dotenv';
import { logger } from '../../logger';

const requestify = require('requestify');

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
    .request(url, { method })
    .then((response: any) => response.getBody())
    .catch(
      (err: any) => {
        logger.debug(err);
        logger.error(`Error finding clothes: url ${url} method ${method} in Catalog.findAll`);
      },
    );
};
