import { client } from './client';

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
