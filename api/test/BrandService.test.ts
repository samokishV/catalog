/* eslint-env mocha */
import 'mocha';
import * as dotenv from 'dotenv';
import supertest from 'supertest';
import { expect } from 'chai';
import { Connection } from 'typeorm';
import { Brands } from '../src/models/Brands';
import {
  initConnectDB, initServer, close, disconnect,
} from './setup';
import * as BrandService from '../src/services/BrandService';
import elastic from 'elasticsearch';
import mockery from 'mockery';

dotenv.config({ path: '.env' });

let connection: Connection;

const port: number = parseInt(process.env.TEST_PORT, 10);
const hostname = process.env.TEST_HOST;

const baseURL = `${hostname}:${port}`;
const server: supertest.SuperTest<supertest.Test> = supertest.agent(baseURL);
const elasticHost = process.env.ELASTIC_TEST_HOST;
const elasticPort = process.env.ELASTIC_TEST_PORT;

describe('BrandElastic and /api/brands route tests', async () => {
  let fakeClient: elastic.Client = new elastic.Client({
    host: `${elasticHost}:${elasticPort}`
  });

  const brands = [
    { id: 1, name: 'Foo' },
    { id: 2, name: 'Bar' },
    { id: 3, name: 'Rizz' },
    { id: 4, name: 'Rak' },
  ];

  before(async () => {
    const client = {
      client: fakeClient
    }

    mockery.registerMock('./client', client);

    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false
    });

    const initServer = require('./setup').initServer;
    await initServer();
  });

  after(async () => {
    const close = require('./setup').close;
    await close();
    mockery.disable();
    mockery.deregisterMock('./client');
  });

  beforeEach(async () => {
    await fakeClient.indices.create({index: "catalog_brands"});

    for(const brand of brands) {
      await fakeClient.index({
        index: 'catalog_brands',
        id: `${brand.id}`,
        type: 'brands',
        body: {
          "id":  brand.id,
          "name": brand.name
        }
      });
    };

    await fakeClient.indices.refresh({ index: 'catalog_brands' })
  });

  afterEach(async () => {
    await fakeClient.indices.delete({ index: "catalog_brands" });
  });

  describe('# BrandElastic.getAll()', () => {
    it('should return array of brand objects', async () => {
      const BrandsElastic = require('../src/services/BrandsElastic');
      const result = await BrandsElastic.getAll();
      expect(result).to.eql(brands);
    });
  });

  describe('# GET api/brands', () => {
    const brands = [
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
        .end((err: any, res: supertest.Response) => {
          expect(res.body).to.eql(brands);
          if (err) return done(err);
          done();
        });
    });

    it('should return empty array', async () => {
      await fakeClient.indices.delete({ index: "catalog_brands" });
      await fakeClient.indices.create({index: "catalog_brands"});

      return server
        .get('/api/brands')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect([]);
    });
  });
});

describe('BrandService tests', async () => {
  const brands = [
    { id: 1, name: 'Foo' },
    { id: 2, name: 'Bar' },
    { id: 3, name: 'Rizz' },
    { id: 4, name: 'Rak' },
  ];

  before(async () => {
    await initServer();
    connection = await initConnectDB();
  });

  after(async () => {
    await disconnect();
    await close();
  });

  beforeEach(async () => {
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
    it('should return array of brand objects', async () => {
      const expected = [
        { id: 1, name: 'Foo' },
        { id: 2, name: 'Bar' },
        { id: 3, name: 'Rizz' },
        { id: 4, name: 'Rak' },
      ];

      const result = await BrandService.getAll();
      expect(result).to.eql(expected);
    });
  });
});

