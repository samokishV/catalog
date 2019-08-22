import { getConnectionManager, createQueryBuilder, Brackets, OrderByCondition, SelectQueryBuilder, WhereExpression } from 'typeorm';
import { Clothes } from '../models/Clothes';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const itemsOnPage = 15;
const baseURL = process.env.APP_BASE_URL;

/**
 * 
 * @param {string} keyword 
 * @param {string} brand 
 * @param {string} size 
 * @param {string} sort 
 * @param {number} page 
 * @return {Promise<unknown[]>}
 */
export const getAll = async (keyword: string, brand: string, size: string, sort: string, page: number = 1): Promise<unknown[]> => {
  const limit = itemsOnPage;
  const offset = (page - 1) * limit;
  const sortCondition = getSortCondition('clothes', sort);

  const data = await createQueryBuilder('clothes', 'clothes')
    .innerJoinAndSelect('clothes.brand', 'brand')
    .innerJoinAndSelect('clothes.type', 'type')
    .innerJoinAndSelect('clothes.sizes', 'sizes')
    .where('1 = 1')
    .andWhere((qb : SelectQueryBuilder<Clothes>) : any  => {
      qb.where('1 = 1');
      getWhereKeywordQuery(qb, keyword);
      getWhereBrandQuery(qb, brand);
      getWhereSizeQuery(qb, size);
    })
    .orderBy(sortCondition)
    .skip(offset)
    .take(limit)
    .getMany();

  return data;
};

/**
 * 
 * @param {SelectQueryBuilder<Clothes>} subQuery 
 * @param {string} keyword 
 * @return {SelectQueryBuilder<Clothes>} | void
 */
export const getWhereKeywordQuery = (subQuery : SelectQueryBuilder<Clothes>, keyword: string) : SelectQueryBuilder<Clothes> | void =>  {
  if (keyword) {
    return subQuery.andWhere(`( MATCH(clothes.name) AGAINST ('${keyword}') OR brand.name like :name OR type.name like :name )`, {name: '%' + keyword + '%'});
  }
}

/**
 * 
 * @param {SelectQueryBuilder<Clothes>} subQuery 
 * @param {string} brand
 * @return {SelectQueryBuilder<Clothes>} | void 
 */
export const getWhereBrandQuery = (subQuery : SelectQueryBuilder<Clothes>, brand: string) : SelectQueryBuilder<Clothes> | void =>  {
  if (brand) {
    return subQuery.andWhere('brand.name = :brand', { brand });
  }
}

/**
 * 
 * @param {SelectQueryBuilder<Clothes>} subQuery 
 * @param {string} size
 * @return {SelectQueryBuilder<Clothes>} | void 
 */
export const getWhereSizeQuery = (subQuery : SelectQueryBuilder<Clothes>, size: string) : SelectQueryBuilder<Clothes> | void =>  {
  if(size) {
    return subQuery.andWhere(`clothes.id IN ${
      subQuery.subQuery()
        .select('clothId')
        .from('clothes', 'clothes')
        .leftJoin('clothes.sizes', 's')
        .where('value = :size', { size })
        .getQuery()
      }`);
  }
}

/**
 * @return {Promise<number>}
 */
export const getTotal = async (): Promise<number> => {
  const connection = await getConnectionManager().get();
  const catalogRepository = await connection.getRepository(Clothes);
  const data = await catalogRepository.count();
  return data;
};

/**
 * @return {Promise<number>}
 */
export const countPages = async (): Promise<number> => {
  const total = await getTotal();
  const pageCount = total / itemsOnPage;
  return Math.ceil(pageCount);
};

/**
 * 
 * @param {number} page
 * @param {string} 
 */
export const getPrevPage = (page: number = 1): string => {
  if (page == 1) return '';
  const prev = --page;
  const prevPage = `${baseURL}/api/catalog?p=${prev}`;
  return prevPage;
};

/**
 * 
 * @param {number} page
 * @return {Promise<string>} 
 */
export const getNextPage = async (page: number = 1): Promise<string> => {
  const totalPages = await countPages();
  if (page == totalPages) return '';
  const next = ++page;
  const nextPage = `${baseURL}/api/catalog?p=${next}`;
  return nextPage;
};

/**
 * 
 * @param {string} order
 * @return {object} 
 */
export const getSortParams = (order: string) => {
  let sortOptions;
  let field:string = "id"; 
  let type: "ASC" | "DESC" = "ASC";

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
 * @param {string} order
 * @return {OrderByCondition} 
 */
export const getSortCondition = (tableAlias: string, order: string) => {
  const sortOptions = getSortParams(order);
  const sortField = sortOptions.field;
  const sortType = sortOptions.type;

  const field: string = `${tableAlias}.${sortField}`;
  const type:"ASC" | "DESC" = sortType;

  const sortCond: OrderByCondition = {'sizes.value': 'ASC', [field]: type};
  return sortCond;
}
