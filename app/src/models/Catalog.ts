import requestify = require('requestify');

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

/**
 * 
 * @param {number} page 
 * @param {string} params 
 * @return {object}
 */
export const findAll = (page: number, params: string) => requestify
  .request(`${apiBaseURL}/api/catalog${params}&page=${page}`, { method: 'GET' })
  .then(response => response.getBody())
  .catch(err => console.log(err));
