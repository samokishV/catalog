import { getConnectionManager, getConnection } from 'typeorm';
import { Brands } from '../models/Brands';

export const getAll = async () => {
  const connection = await getConnection('default');
  const BrandsRepository = await connection.getRepository(Brands);
  const data = await BrandsRepository.find({});

  return data;
};
