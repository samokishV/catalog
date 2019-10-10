import { client } from './client';

const itemsOnPage = 15;

export class CatalogElastic {
    keyword: string;

    brand: string;

    size: string;

    sort = 'default';

    page = 1;

    total: number;

    constructor()

    constructor(keyword: string, brand: string, size: string, sort: string, page: number)

    constructor(keyword?: string, brand?: string, size?: string, sort = 'default', page = 1) {
      this.keyword = keyword;
      this.brand = brand;
      this.size = size;
      this.sort = sort;
      this.page = page;
    }

    /**
     * @return {Promise<unknown[]>}
     */
    async getLimit(): Promise<unknown[]> {
      const limit = itemsOnPage;
      const offset = (this.page - 1) * limit;
      const query = this.getComplexQuery();
      const sort = this.getSortCondition();

      const data = await client.search({
        index: 'catalog_clothes_denormal',
        from: offset,
        size: limit,
        body: {
          _source: ['id', 'name', 'brand', 'type', 'sizes'],
          query,
          sort
        },
      });

      const results = data.hits.hits.map((i: { _source: any; }) => i._source);

      return results;
    }

    /**
     * @return {Object}
     */
    getComplexQuery() {
      const keywordQuery = this.getWhereKeywordQuery();
      const brandQuery = this.getWhereBrandQuery();
      const sizeQuery = this.getWhereSizeQuery();
      const must: Array<Record<string, any>> = [];

      if (keywordQuery) {
        must.push(keywordQuery);
      }

      if (brandQuery) {
        must.push(brandQuery);
      }

      if (sizeQuery) {
        must.push(sizeQuery);
      }

      let complexQuery;

      if (must) {
        complexQuery = {
          bool: {
            must,
          },
        };
      } else {
        complexQuery = {
          match_all: {},
        };
      }

      return complexQuery;
    }

    /**
     * @return {Object}
     */
    getWhereKeywordQuery(): Record<string, any> {
      if (this.keyword) {
        this.keyword = this.keyword.trim();

        const keywordQuery = {
          multi_match: {
            query: this.keyword, 
            fields: [ "name", "brand.name", "type.name" ],
            operator: "and",
            fuzziness: "AUTO" 
          }
        };

        return keywordQuery;
      }
    }

    /**
     * @return {Object}
     */
    getWhereBrandQuery(): Record<string, any> {
      if (this.brand) {
        const brandQuery = {
          match_phrase: { "brand.name": this.brand },
        };
        return brandQuery;
      }
    }

    /**
     * @return {Object}
     */
    getWhereSizeQuery(): Record<string, any> {
      if (this.size) {
        const sizeQuery = {
          term: { "sizes.value.keyword": this.size },
        };
        return sizeQuery;
      }
    }

    /**
     * @return {Promise<number>}
     */
    async getTotal(): Promise<number> {
      if (!this.total) {
        await this.setTotal();
      }
      return this.total;
    }

    /**
     * @return {Promise<void>}
     */
    async setTotal(): Promise<void> {
      const data = await this.countTotal();
      this.total = data;
    }

    /**
     * @return {Promise<number>}
     */
    async countTotal(): Promise<number> {
      const query = this.getComplexQuery();

      const data = await client.search({
        index: 'catalog_clothes_denormal',
        body: {
          query: query,
          aggs: {
            id_stats: {
              stats: {
                field: 'id',
              },
            },
          },
        }
      });

      return data.aggregations.id_stats.count;
    }

    /**
     * @return {Promise<number>}
     */
    async countPages(): Promise<number> {
      const total = await this.getTotal();
      const pageCount = total / itemsOnPage;
      return Math.ceil(pageCount);
    }

    /**
     * @return {string}
     */
    getPrevPage(): string {
      if (this.page == 1) return '';
      let { page } = this;
      const prev = --page;
      const prevPage = `/api/catalog?page=${prev}`;
      return prevPage;
    }

    /**
     * @return {Promise<string>}
     */
    async getNextPage(): Promise<string> {
      const totalPages = await this.countPages();
      if (this.page == totalPages) return '';
      let { page } = this;
      const next = ++page;
      const nextPage = `/api/catalog?page=${next}`;
      return nextPage;
    }

    /**
     * @return {object}
     */
    getSortParams() {
      let sortOptions;
      let field = 'id';
      let type: 'ASC' | 'DESC' = 'ASC';
      const order = this.sort;

      if (order && order !== 'default') {
        const sort = order.split('-');
        field = sort[0];

        if (sort[1].toUpperCase() === 'DESC') {
          type = 'DESC';
        }
      }

      sortOptions = { field, type };
      return sortOptions;
    }

    /**
     * @return {Array}
     */
    getSortCondition(): Array<object> {
      const sortOptions = this.getSortParams();
      const sortField = sortOptions.field;
      const sortType = sortOptions.type;

      let sortCondition;

      if(sortField == "name") {
        sortCondition = [
          {"_script": {
            "script": "doc['name.keyword'].value.toLowerCase()",
            "type": "string",
            "order": sortType
            }}
        ];
      } else {
        sortCondition = [
          { [sortField]: { order: sortType }}
        ];
      }

      return sortCondition;
    }
}
