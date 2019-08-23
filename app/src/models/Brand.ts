import requestify = require('requestify');

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

/**
 * @return {object}
 */
export const findAll = () => requestify
  .get(`${apiBaseURL}/api/brands`)
  .then(response => response.getBody());
