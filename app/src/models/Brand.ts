import * as dotenv from 'dotenv';
import { logger } from '../../logger';

import requestify = require('requestify');

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
    .then(response => response.getBody())
    .catch(
      (err) => {
        logger.debug(err);
        logger.error(`Error finding brands: url ${url} method ${method} in Brand.findAll`);
      },
    );
};
