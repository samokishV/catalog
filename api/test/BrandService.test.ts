/* eslint-env mocha */
import 'mocha';
import * as dotenv from 'dotenv';
import supertest from "supertest";
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Brands } from '../src/models/Brands';

import BrandService = require('../src/services/BrandService');
import mysql = require('../connection');

dotenv.config({ path: '.env' });

const baseURL = process.env.APP_BASE_URL;
const server = supertest.agent(baseURL);

describe('BrandService and /api/brands route Tests', () => {
  const brands = [
    { id: 1, name: 'Foo' },
    { id: 2, name: 'Bar' },
    { id: 3, name: 'Rizz' },
    { id: 4, name: 'Rak' },
  ];

  let expected: Array<Brands>;

  before(async () => {
    await mysql.connect();
    const connection = await getConnection();
    await connection.manager.getRepository(Brands).delete({});

    await connection.manager
      .createQueryBuilder()
      .insert()
      .into(Brands)
      .values(brands)
      .execute();

    expected = await connection
      .getRepository(Brands)
      .createQueryBuilder()
      .getMany();
  });

  describe('#getAll()', () => {
    it('should return array of brand objects', async () => {
      const result = await BrandService.getAll();
      expect(result).to.eql(expected);
    });
  });

  describe('# GET api/brands', () => {
    it("responds with json", (done) => {
      server
      .get('/api/brands')
      .expect("Content-type",/json/)
      .expect(200)
      .end((err,res) => {
        if (err) return done(err);
        done();
      });
    });

    it("should return 404", async () => {
      await mysql.connect();
      const connection = await getConnection();
      await connection.manager.getRepository(Brands).delete({});

      server
      .get('/api/brands')
      .expect(404);
    });
  });

  after(async () => {
    await mysql.connect();
    const connection = await getConnection();
    await connection.manager.getRepository(Brands).delete({});
  });
});

