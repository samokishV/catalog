import { Connection, createConnection, getConnection } from 'typeorm';
import express from 'express';
import * as route from '../src/route';
import { Types } from '../src/models/Types';
import { Clothes } from '../src/models/Clothes';
import { Brands } from '../src/models/Brands';
import { Sizes } from '../src/models/Sizes';
import { ClothSize } from '../src/models/ClothSizes';
import { TypeToSize } from '../src/models/TypeToSizes';

const config = require('../config/knexfile-test');
const knex = require('knex')(config);

// @ts-ignore
let server;
let connection: Connection | void;

const port: number = parseInt(process.env.TEST_PORT, 10);
const hostname = process.env.TEST_HOST;

export const initServer = () => {
  const app = express();
  route.start(app);

  server = app.listen(port, hostname);
  console.log(` Now listening test server on ${port}`);
};

export const close = async () => {
  // @ts-ignore
  await server.close();
  console.log(`Close test server connection on ${port}`);
};

export const initConnectDB = async () => {
  if (!connection) {
    connection = await createConnection({
      name: 'default',
      type: 'mysql',
      host: process.env.TEST_DB_HOST,
      username: process.env.TEST_DB_USERNAME,
      password: process.env.TEST_DB_PASSWORD,
      database: process.env.TEST_DB_NAME,
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
    }).catch(err => console.log(err));
  }

  console.log('Database is connect.');

  return await getConnection();
};

export const disconnect = async () => {
  if (connection) {
    await connection.close();

    connection = null;

    console.log('Database is disconnect.');
  }
};
