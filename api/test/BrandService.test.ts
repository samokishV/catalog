/* eslint-env mocha */
import 'mocha';
import * as dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import { Connection } from 'typeorm';
import { Brands } from '../src/models/Brands';
import {
  initConnectDB, initServer, close, disconnect,
} from '../setup';

import BrandService = require('../src/services/BrandService');

dotenv.config({ path: '.env' });

let connection: Connection;

const port: number = parseInt(process.env.TEST_PORT, 10);
const hostname = process.env.TEST_HOST;

const baseURL = `${hostname}:${port}`;
const server: supertest.SuperTest<supertest.Test> = supertest.agent(baseURL);


describe('BrandService and /api/brands route Tests', async () => {
  before(async () => {
    await initServer();
    connection = await initConnectDB();
  });

  after(async () => {
    await disconnect();
    await close();
  });

  beforeEach(async () => {
    const brands = [
      { id: 1, name: 'Foo' },
      { id: 2, name: 'Bar' },
      { id: 3, name: 'Rizz' },
      { id: 4, name: 'Rak' },
    ];

    await connection
      .createQueryBuilder()
      .insert()
      .into(Brands)
      .values(brands)
      .execute();
  });

  afterEach(async () => {
    await connection.getRepository(Brands).delete({});
  });

  describe('#getAll()', () => {
    const expected = [
      { id: 1, name: 'Foo' },
      { id: 2, name: 'Bar' },
      { id: 3, name: 'Rizz' },
      { id: 4, name: 'Rak' },
    ];

    it('should return array of brand objects', async () => {
      const result = await BrandService.getAll();
      expect(result).to.eql(expected);
    });
  });

  describe('# GET api/brands', () => {
    const expected = [
      { id: 1, name: 'Foo' },
      { id: 2, name: 'Bar' },
      { id: 3, name: 'Rizz' },
      { id: 4, name: 'Rak' },
    ];

    it('responds with json', (done) => {
      server
        .get('/api/brands')
        .expect('Content-type', /json/)
        .expect(200)
        .end((err:any, res:supertest.Response) => {
          expect(res.body).to.eql(expected);
          if (err) return done(err);
          done();
        });
    });

    it('should return empty array', async () => {
      await connection.getRepository(Brands).delete({});

      return server
        .get('/api/brands')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect([]);
    });
  });
});
