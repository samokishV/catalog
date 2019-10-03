import { client } from './client';

/**
 * @return {Promise<Brands>}
 */
export const getAll = async () => {
  const data = await client.search({
    index: 'catalog_brands',
    size: 10000,
    body: {
      _source: ['id', 'name'],
    }
  });

  const results = data.hits.hits.map((i: { _source: any; }) => i._source);

  return results;
};
