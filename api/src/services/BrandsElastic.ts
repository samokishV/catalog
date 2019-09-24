import elastic from 'elasticsearch';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const elasticHost = process.env.ELASTIC_HOST;

export const client = new elastic.Client({
  host: `${elasticHost}:9200`,
});

/**
 * @return {Promise<Brands>}
 */
export const getAll = async () => {
  const data = await client.search({
    index: 'catalog_brands',
    size: 10000,
  });

  const results = data.hits.hits.map(i => i._source);

  return results;
};
