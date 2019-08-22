import { getConnectionManager, createQueryBuilder, Brackets, OrderByCondition, SelectQueryBuilder, WhereExpression } from 'typeorm';
import { Clothes } from '../models/Clothes';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const itemsOnPage = 15;
const baseURL = process.env.APP_BASE_URL;

export class CatalogService {

  keyword: string;
  brand: string;
  size: string;
  sort: string;
  page: number = 1;

  constructor(keyword: string, brand: string, size: string, sort: string = "default", page: number = 1) {
      this.keyword = keyword;
      this.brand = brand;
      this.size = size;
      this.sort = sort;
      this.page = page;
  }

  /**
   * @return {Promise<unknown[]>}
   */
  async getLimit(): Promise<unknown[]>  {
    const limit = itemsOnPage;
    const offset = (this.page - 1) * limit;

    console.log("limit"+limit+"offset"+offset);

    const query = await this.getAllQuery();
    const data = query    
      .skip(offset)
      .take(limit)
      .getMany();

    return data;
  }

  /**
   * @return {Promise<SelectQueryBuilder<unknown>>}
   */
  async getAllQuery(): Promise<SelectQueryBuilder<unknown>> {
    const sortCondition = this.getSortCondition('clothes');

    const query = await createQueryBuilder('clothes', 'clothes')
      .innerJoinAndSelect('clothes.brand', 'brand')
      .innerJoinAndSelect('clothes.type', 'type')
      .innerJoinAndSelect('clothes.sizes', 'sizes')
      .where('1 = 1')
      .andWhere((qb : SelectQueryBuilder<Clothes>) : any  => {
        qb.where('1 = 1');
        this.getWhereKeywordQuery(qb);
        this.getWhereBrandQuery(qb);
        this.getWhereSizeQuery(qb);
      })
      .orderBy(sortCondition);

    return query;
  };

  /**
   * 
   * @param {SelectQueryBuilder<Clothes>} subQuery 
   * @return {SelectQueryBuilder<Clothes>} | void
   */
    getWhereKeywordQuery(subQuery : SelectQueryBuilder<Clothes>) : SelectQueryBuilder<Clothes> | void  {
      if (this.keyword) {
        return subQuery.andWhere(`( MATCH(clothes.name) AGAINST ('${this.keyword}') OR brand.name like :name OR type.name like :name )`, {name: '%' + this.keyword + '%'});
      }
    }

  /**
   * 
   * @param {SelectQueryBuilder<Clothes>} subQuery 
   * @return {SelectQueryBuilder<Clothes>} | void 
   */
  getWhereBrandQuery(subQuery : SelectQueryBuilder<Clothes>) : SelectQueryBuilder<Clothes> | void  {
    if (this.brand) {
      return subQuery.andWhere('brand.name = :brand', { brand: this.brand });
    }
  }

  /**
   * 
   * @param {SelectQueryBuilder<Clothes>} subQuery 
   * @return {SelectQueryBuilder<Clothes>} | void 
   */
  getWhereSizeQuery(subQuery : SelectQueryBuilder<Clothes>) : SelectQueryBuilder<Clothes> | void {
    if(this.size) {
      return subQuery.andWhere(`clothes.id IN ${
        subQuery.subQuery()
          .select('clothId')
          .from('clothes', 'clothes')
          .leftJoin('clothes.sizes', 's')
          .where('value = :size', { size: this.size })
          .getQuery()
        }`);
    }
  }

  /**
   * @return {Promise<number>}
   */
  async getTotal(): Promise<number> {
    const query = await this.getAllQuery();
    const data = query.getCount();
    return data;
  };

  /**
   * @return {Promise<number>}
   */
  async countPages(): Promise<number> {
    const total = await this.getTotal();
    const pageCount = total / itemsOnPage;
    return Math.ceil(pageCount);
  };  

  /**
   * @return {string} 
   */
  getPrevPage(): string {
    if (this.page == 1) return '';
    let page = this.page;
    const prev = --page;
    const prevPage = `${baseURL}/api/catalog?p=${prev}`;
    return prevPage;
  };

  /**
   * @return {Promise<string>} 
   */
  async getNextPage(): Promise<string> {
    const totalPages = await this.countPages();
    if (this.page == totalPages) return '';
    let page = this.page;
    const next = ++page;
    const nextPage = `${baseURL}/api/catalog?p=${next}`;
    return nextPage;
  };

  /**
   * @return {object} 
   */
  getSortParams() {
    let sortOptions;
    let field:string = "id"; 
    let type: "ASC" | "DESC" = "ASC";
    let order = this.sort;

    if (order && order !== 'default') {
      const sort = order.split('-');
      field = sort[0];

      if(sort[1].toUpperCase()=="DESC") {
        type = "DESC";
      } 
    }

    sortOptions = { field: field, type: type };
    return sortOptions;
  };

  /**
   * 
   * @param {string} tableAlias 
   * @return {OrderByCondition} 
   */
  getSortCondition = (tableAlias: string) => {
    const sortOptions = this.getSortParams();
    const sortField = sortOptions.field;
    const sortType = sortOptions.type;

    const field: string = `${tableAlias}.${sortField}`;
    const type:"ASC" | "DESC" = sortType;

    const sortCond: OrderByCondition = {
      //'sizes.value': 'ASC', 
      [field]: type
  };
    return sortCond;
  }
}
