import { getConnectionManager, createQueryBuilder, Brackets } from 'typeorm';
import { Clothes } from '../models/Clothes';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const itemsOnPage = 15;
const baseURL = process.env.APP_BASE_URL;

export const getAll = async (keyword: string, brand: string, size: string, sort: string, page = 1) => {
  const limit = itemsOnPage;
  const offset = (page - 1) * limit;
  const sortOptions = sortCondition(sort);
  const sortField = sortOptions.field;
  const sortType = sortOptions.type;

  const query = await createQueryBuilder('clothes', 'clothes')
    .select(['clothes.id', 'clothes.name', 'brand', 'type', 'sizes'])
    .innerJoin('clothes.brand', 'brand')
    .innerJoin('clothes.type', 'type')
    .innerJoin('clothes.sizes', 'sizes')
    .where('1 = 1');

  if (keyword) {
    query.andWhere(`( MATCH(clothes.name) AGAINST ('${keyword}') OR brand.name like :name OR type.name like :name )`, {name: '%' + keyword + '%'});
  }

  if (brand) {
    query.andWhere('brand.name = :brand', { brand });
  }

  if (size) {
    query.andWhere(`clothes.id IN ${
      query.subQuery()
        .select('clothId')
        .from('clothes', 'clothes')
        .leftJoin('clothes.sizes', 'sizes')
        .where('value = :size', { size })
        .getQuery()}`);
  }

  if (sortType === 'DESC') {
    query.orderBy(`clothes.${sortField}`, 'DESC');
  } else {
    query.orderBy(`clothes.${sortField}`, 'ASC');
  }

  query.addOrderBy('sizes.value', 'ASC');

  const data = query
    .skip(offset)
    .take(limit)
    .getMany();

  return data;
};

export const getTotal = async () => {
  const connection = await getConnectionManager().get();
  const catalogRepository = await connection.getRepository(Clothes);
  const data = await catalogRepository.count();
  return data;
};

export const countPages = async () => {
  const total = await getTotal();
  const pageCount = total / itemsOnPage;
  return Math.ceil(pageCount);
};

export const getPrevPage = (page = 1) => {
  if (page == 1) return '';
  const prev = --page;
  const prevPage = `${baseURL}/api/catalog?p=${prev}`;
  return prevPage;
};

export const getNextPage = async (page = 1) => {
  const totalPages = await countPages();
  if (page == totalPages) return '';
  const next = ++page;
  const nextPage = `${baseURL}/api/catalog?p=${next}`;
  return nextPage;
};

export const sortCondition = (order: string) => {
  let sortOptions;
  if (order && order !== 'default') {
    const sort = order.split('-');
    const field: string = sort[0];
    const type = sort[1];
    sortOptions = { field, type: type.toUpperCase() };
  } else {
    sortOptions = { field: 'id', type: 'ASC' };
  }
  return sortOptions;
};
