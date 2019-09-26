import elastic from 'elasticsearch';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const elasticHost = process.env.ELASTIC_HOST;

export const client : elastic.Client = new elastic.Client({
  host: `${elasticHost}:9200`,
});
