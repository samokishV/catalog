const requestify = require('requestify');

import {logger} from '../../logger';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

/**
 * @return {object}
 */
export const findAll = () => {
  const url = `${apiBaseURL}/api/types/sizes`;
  const method = 'GET';
  return requestify
  .request(url, { method: method })
  .then(response => response.getBody())
  .catch(
    (err) => {
      logger.debug(err);
      logger.error(`Error finding sizes: url ${url} method ${method} in TypeSize.findAll`);
    },
  );
}
