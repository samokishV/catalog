/* eslint-env mocha */
import 'mocha';
import * as dotenv from 'dotenv';
import supertest from "supertest";
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { TypeToSize } from '../src/models/TypeToSizes';

import TypeSizesService = require('../src/services/TypeSizesService');
import mysql = require('../connection');

dotenv.config({ path: '.env' });

const baseURL = process.env.APP_BASE_URL;
const server = supertest.agent(baseURL);

describe('TypeSizesService and /api/types/sizes route Tests', () => {
  const type = [
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

  const expected: Array<Types> = [
    { id: 1, name: 'shoes', sizes: [{ id: 1, value: '44' }, { id: 2, value: '45' }] },
    { id: 2, name: 'dress', sizes: [sizes[2]] },
  ];

  before(async () => {
    await mysql.connect();
    const connection = await getConnection();
    connection.manager.getRepository(Types).delete({});
    connection.manager.getRepository(Sizes).delete({});
    connection.manager.getRepository(TypeToSize).delete({});

    await connection.manager
      .createQueryBuilder()
      .insert()
      .into(Types)
      .values(type)
      .execute();

    await connection.manager
      .createQueryBuilder()
      .insert()
      .into(Sizes)
      .values(sizes)
      .execute();

    await connection.manager
      .createQueryBuilder()
      .insert()
      .into(TypeToSize)
      .values(typeSizes)
      .execute();
  });

  describe('#getAll()', () => {
    it('should return array of type objects', async () => {
      const result = await TypeSizesService.getAll();
      expect(result).to.eql(expected);
    });
  });

  describe('# GET /api/types/sizes', () => {
    it("responds with json", (done) => {
      server
      .get('/api/types/sizes')
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
      connection.manager.getRepository(Types).delete({});
      connection.manager.getRepository(Sizes).delete({});
      connection.manager.getRepository(TypeToSize).delete({});

      server
      .get('/api/types/sizes')
      .expect(404);
    });
  });

  after(async () => {
    await mysql.connect();
    const connection = await getConnection();
    connection.manager.getRepository(Types).delete({});
    connection.manager.getRepository(Sizes).delete({});
    connection.manager.getRepository(TypeToSize).delete({});
  });
});
