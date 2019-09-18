import * as dotenv from 'dotenv';
import { logger } from '../../logger';

const requestify = require('requestify');

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

/**
 * @return {object}
 */
export const findAll = () => {
  const url = `${apiBaseURL}/api/brands`;
  const method = 'GET';
  return requestify
    .request(url, { method })
    .then((response: any) => response.getBody())
    .catch(
      (err: any) => {
        logger.debug(err);
        logger.error(`Error finding brands: url ${url} method ${method} in Brand.findAll`);
      },
    );
};
