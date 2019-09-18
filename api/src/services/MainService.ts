import { endpoints } from '../route';

/**
 * @return {Array<object>}
 */
export const getRoutes = (): Array<object> => {
  const data: Array<object> = endpoints;

  return data;
};
