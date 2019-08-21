const requestify = require('requestify');

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const baseURL = process.env.APP_BASE_URL;

export const options = {
    swaggerOptions: {
      url: `${baseURL}/api-docs.json`
    }
  }  