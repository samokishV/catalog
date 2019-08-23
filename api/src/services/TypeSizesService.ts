import { getConnectionManager } from 'typeorm';
import { Types } from '../models/Types';

/**
 * @return {Promise<Types>}
 */
export const getAll = async () => {
  const connection = await getConnectionManager().get();

  const TypesRepository = await connection.getRepository(Types);

  const data = await TypesRepository.find({
    select: ['id', 'name'],
    relations: ['sizes'],
  });

  return data;
};
