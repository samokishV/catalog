import * as dotenv from 'dotenv';

import {
  createConnections, Connection, createConnection, getConnection,
} from 'typeorm';
import { Clothes } from '../models/Clothes';
import { Brands } from '../models/Brands';
import { Types } from '../models/Types';
import { Sizes } from '../models/Sizes';
import { ClothSize } from '../models/ClothSizes';
import { TypeToSize } from '../models/TypeToSizes';

dotenv.config({ path: '.env' });

let connection: Connection | void;

export const connect = async () => {
  if (!connection) {
    connection = await createConnection({
      name: 'default',
      type: 'mysql',
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      logging: false,
      entities: [
        Clothes,
        Brands,
        Types,
        Sizes,
        ClothSize,
        TypeToSize,
      ],
    })
      .then(result => console.log('Sucessfully connect to db'))
      .catch(err => console.log(err));
  }
  return connection;
};
