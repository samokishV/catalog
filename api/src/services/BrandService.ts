import { getConnection } from 'typeorm';
import { Brands } from '../models/Brands';

/**
 * @return {Promise<Brands>}
 */
export const getAll = async () => {
  const connection = await getConnection();
  const BrandsRepository = await connection.getRepository(Brands);
  const data = await BrandsRepository.find({
    order: {
      id: "ASC"
    }
  });

  return data;
};
