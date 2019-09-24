import elastic from 'elasticsearch';
import _ from 'lodash';

import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const elasticHost = process.env.ELASTIC_HOST;

export const client = new elastic.Client({
  host: `${elasticHost}:9200`,
});

/**
 * @return {Promise<TypeSizes>}
 */
export const getAll = async () => {
  const data = await client.search({
    index: 'catalog_type_sizes_denormal',
    size: 10000,
    body: {
      _source: ['id', 'name', 'value'],
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

  const resultsGroupByType = _.chain(results)
  // Group the elements of Array based on `name` property
    .groupBy('name')
  // `key` is group's name (name), `value` is the array of objects
    .map((value, key) => ({ name: key, sizes: value }))
    .value();

  return resultsGroupByType;
};
