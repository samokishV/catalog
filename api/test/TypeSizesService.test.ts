/* eslint-env mocha */
import 'mocha';
import * as dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import { Connection } from 'typeorm';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { TypeToSize } from '../src/models/TypeToSizes';
import {
  initConnectDB, initServer, close, disconnect,
} from '../setup';
import * as TypeSizesService from '../src/services/TypeSizesService';

dotenv.config({ path: '.env' });

let connection: Connection;

const port: number = parseInt(process.env.TEST_PORT, 10);
const hostname = process.env.TEST_HOST;

const baseURL = `${hostname}:${port}`;
const server: supertest.SuperTest<supertest.Test> = supertest.agent(baseURL);

let expected: Array<Types>;

describe('TypeSizesService and /api/types/sizes route Tests', () => {
  before(async () => {
    await initServer();
    connection = await initConnectDB();
  });

  after(async () => {
    await disconnect();
    await close();
  });

  beforeEach(async () => {
    const types = [
      { id: 1, name: 'shoes' },
      { id: 2, name: 'dress' },
    ];

    const sizes: Array<Sizes> = [
      { id: 1, value: '44' },
      { id: 2, value: '45' },
      { id: 3, value: 'XL' },
    ];

    const typeSizes = [
      { id: 1, typeId: 1, sizeId: 1 },
      { id: 2, typeId: 1, sizeId: 2 },
      { id: 3, typeId: 2, sizeId: 3 },
    ];

    expected = [
      { id: 1, name: 'shoes', sizes: [{ id: 1, value: '44' }, { id: 2, value: '45' }] },
      { id: 2, name: 'dress', sizes: [sizes[2]] },
    ];

    const arr = [
      { model: Types, values: types },
      { model: Sizes, values: sizes },
      { model: TypeToSize, values: typeSizes },
    ];

    for (const obj of arr) {
      await connection.manager
        .createQueryBuilder()
        .insert()
        .into(obj.model)
        .values(obj.values)
        .execute();
    }
  });

  afterEach(async () => {
    await connection.manager.getRepository(Types).delete({});
    await connection.manager.getRepository(Sizes).delete({});
    await connection.manager.getRepository(TypeToSize).delete({});
  });

  describe('#getAll()', () => {
    it('should return array of type objects', async () => {
      const result = await TypeSizesService.getAll();
      expect(result).to.eql(expected);
    });
  });

  describe('# GET /api/types/sizes', () => {
    it('responds with json', (done) => {
      server
        .get('/api/types/sizes')
        .expect('Content-type', /json/)
        .expect(200)
        .expect(expected)
        .end((err: any, res: supertest.Response) => {
          if (err) return done(err);
          done();
        });
    });

    it('should return empty array', async () => {
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(TypeToSize).delete({});

      await server
        .get('/api/types/sizes')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect([]);
    });
  });
});
