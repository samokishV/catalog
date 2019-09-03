import * as dotenv from 'dotenv';
import {routes} from '../../route';

dotenv.config({ path: '.env' });

const baseURL = process.env.APP_BASE_URL;

/**
 * @return {Array<string>}
 */
export const getRoutes = () : Array<string> => {
  const data: Array<string> = [
    `${baseURL}${routes.getLink('catalog')}`,
    `${baseURL}${routes.getLink('type-sizes')}`,
    `${baseURL}${routes.getLink('brands')}`,    
  ];

  return data;
};