import {
  createQueryBuilder, OrderByCondition, SelectQueryBuilder, getRepository,
} from 'typeorm';
import * as dotenv from 'dotenv';
import { Clothes } from '../models/Clothes';

dotenv.config({ path: '.env' });

const itemsOnPage = 15;

export class CatalogService {
  keyword: string;

  brand: string;

  size: string;

  sort = 'default';

  page: number = 1;

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

  async getAll() {
    return getRepository(Clothes)
      .createQueryBuilder()
      .getMany();
  }

  /**
   * @return {Promise<unknown[]>}
   */
  async getLimit(): Promise<unknown[]> {
    const limit = itemsOnPage;
    const offset = (this.page - 1) * limit;
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
      .select(['clothes.id', 'clothes.name', 'brand', 'type', 'sizes'])
      .innerJoin('clothes.brand', 'brand')
      .innerJoin('clothes.type', 'type')
      .leftJoin('clothes.sizes', 'sizes')
      .where('1 = 1')
      .andWhere((qb: SelectQueryBuilder<Clothes>): any => {
        qb.where('1 = 1');
        this.getWhereKeywordQuery(qb);
        this.getWhereBrandQuery(qb);
        this.getWhereSizeQueryWithSizes(qb);
      })
      .orderBy(sortCondition);

    return query;
  }

  /**
   *
   * @param {SelectQueryBuilder<Clothes>} subQuery
   * @return {SelectQueryBuilder<Clothes>} | void
   */
  getWhereKeywordQuery(subQuery: SelectQueryBuilder<Clothes>): SelectQueryBuilder<Clothes> | void {
    if (this.keyword) {
      return subQuery.andWhere(`( MATCH(clothes.name) AGAINST ('${this.keyword}') OR brand.name like :name OR type.name like :name )`, { name: `%${this.keyword}%` });
    }
  }

  /**
   *
   * @param {SelectQueryBuilder<Clothes>} subQuery
   * @return {SelectQueryBuilder<Clothes>} | void
   */
  getWhereBrandQuery(subQuery: SelectQueryBuilder<Clothes>): SelectQueryBuilder<Clothes> | void {
    if (this.brand) {
      return subQuery.andWhere('brand.name = :brand', { brand: this.brand });
    }
  }

  /**
   *
   * @param {SelectQueryBuilder<Clothes>} subQuery
   * @return {SelectQueryBuilder<Clothes>} | void
   */
  getWhereSizeQuery(subQuery: SelectQueryBuilder<Clothes>): SelectQueryBuilder<Clothes> | void {
    if (this.size) {
      return subQuery.andWhere('sizes.value = :size', { size: this.size });
    }
  }

  /**
   *
   * @param {SelectQueryBuilder<Clothes>} subQuery
   * @return {SelectQueryBuilder<Clothes>} | void
   */
  getWhereSizeQueryWithSizes(subQuery: SelectQueryBuilder<Clothes>): SelectQueryBuilder<Clothes> | void {
    if (this.size) {
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
    if(!this.total) {
      await this.setTotal();
    }
    return this.total;
  }

  /**
   * @return {Promise<number>}
   */
  async setTotal():Promise<number> {
    let data;
    if(this.keyword || this.brand || this.size) {
      data = await this.getTotalWithConditions();
    } else {
      data = await this.getTotalWithoutConditions();
    }
    return this.total = data;
  }

  /**
   * @return {Promise<number>}
   */
  getTotalWithConditions():Promise<number>  {
    return createQueryBuilder('clothes', 'clothes')
      .select(['clothes.id', 'clothes.name', 'brand', 'type', 'sizes'])
      .innerJoin('clothes.brand', 'brand')
      .innerJoin('clothes.type', 'type')
      .leftJoin('clothes.sizes', 'sizes')
      .where('1 = 1')
      .andWhere((qb: SelectQueryBuilder<Clothes>): any => {
        qb.where('1 = 1');
        this.getWhereKeywordQuery(qb);
        this.getWhereBrandQuery(qb);
        this.getWhereSizeQuery(qb);
      })
      .getCount();
  }

  /**
   * @return {Promise<number>}
   */
  async getTotalWithoutConditions():Promise<number>  {
    const catalogRepository = await getRepository(Clothes);
    const data =  await catalogRepository.count();
    return data;
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
   *
   * @param {string} tableAlias
   * @return {OrderByCondition}
   */
  getSortCondition(tableAlias: string) {
    const sortOptions = this.getSortParams();
    const sortField = sortOptions.field;
    const sortType = sortOptions.type;

    const field = `${tableAlias}.${sortField}`;
    const type: 'ASC' | 'DESC' = sortType;

    const sortCond: OrderByCondition = {
      [field]: type,
    };
    return sortCond;
  }
}
