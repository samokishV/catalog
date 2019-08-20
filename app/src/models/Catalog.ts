// @ts-ignore
const requestify = require('requestify');

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const apiBaseURL = process.env.API_BASE_URL;

export const findAll = (keyword: string, brand: string, size: string, page: number, sort: string, params: string) => requestify
  .request(`${apiBaseURL}/api/catalog${params}&page=${page}`, { method: 'GET' })
  .then(response => response.getBody())
  .catch(err => console.log(err));
