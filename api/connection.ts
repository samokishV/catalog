import * as dotenv from 'dotenv';

import { createConnections, Connection, createConnection, getConnection } from 'typeorm';
import { Clothes } from './src/models/Clothes';
import { Brands } from './src/models/Brands';
import { Types } from './src/models/Types';
import { Sizes } from './src/models/Sizes';
import { ClothSize } from './src/models/ClothSizes';
import { TypeToSize } from './src/models/TypeToSizes';

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


