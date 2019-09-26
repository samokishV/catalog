import { client } from './client';

/**
 * @return {Promise<TypeSizes>}
 */
export const getAll = async () => {
  const data = await client.search({
    index: 'catalog_type_sizes_denormal',
    size: 10000,
    body: {
      _source: ['id', 'name', 'sizes'],
      aggs: {
        sizes: {
          terms: {
            field: 'name.keyword',
          },
        },
      },
    },
  });

  const results = data.hits.hits.map(i => i._source);
  return results;
};
