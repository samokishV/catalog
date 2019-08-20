import { getConnectionManager, createQueryBuilder, Brackets } from 'typeorm';
import { Clothes } from '../models/Clothes';

const itemsOnPage = 15;

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
    .where('1 = 1')
    .skip(offset)
    .take(limit);

  if (keyword) {
    query.andWhere(new Brackets((subQb) => {
      subQb.where(`MATCH(clothes.name) AGAINST ('${keyword}' IN BOOLEAN MODE)`)
        .orWhere('brand.name like :brand', { brand: `%${keyword}%` })
        .orWhere('type.name = :type', { type: keyword });
    }));
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

  query.orderBy('sizes.value', 'ASC');

  if (sortType === 'DESC') {
    query.addOrderBy(`clothes.${sortField}`, 'DESC');
  } else {
    query.addOrderBy(`clothes.${sortField}`, 'ASC');
  }

  const data = query.getMany();

  return data;
};

export const getTotal = async () => {
  const connection = await getConnectionManager().get('default');
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
  const prevPage = `http://localhost:1000/api/catalog?p=${prev}`;
  return prevPage;
};

export const getNextPage = async (page = 1) => {
  const totalPages = await countPages();
  if (page == totalPages) return '';
  const next = ++page;
  const nextPage = `http://localhost:1000/api/catalog?p=${next}`;
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
