/* eslint-env mocha */
import 'mocha';
import { Connection } from 'typeorm';
import * as dotenv from 'dotenv';
import supertest from 'supertest';
import { Clothes } from '../src/models/Clothes';
import { ClothSize } from '../src/models/ClothSizes';
import { CatalogService } from '../src/services/CatalogService';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { Brands } from '../src/models/Brands';
import {
  initConnectDB, initServer, close, disconnect,
} from '../setup';

import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const { expect } = chai;

dotenv.config({ path: '.env' });

let connection: Connection;

const port: number = parseInt(process.env.TEST_PORT, 10);
const hostname = process.env.TEST_HOST;

const baseURL = `${hostname}:${port}`;
const server: supertest.SuperTest<supertest.Test> = supertest.agent(baseURL);

describe('CatalogService and /api/catalog route Tests', () => {
  before(async () => {
    await initServer();
    connection = await initConnectDB();
  });

  after(async () => {
    await disconnect();
    await close();
  });

  describe('#getPrevPage()', () => {
    it('should return previous page link', () => {
      const tests = [
        { args: 1, expected: '' },
        { args: 2, expected: '/api/catalog?page=1' },
      ];

      tests.forEach((test) => {
        const catalog = new CatalogService();
        catalog.page = test.args;
        const result = catalog.getPrevPage();
        if (result !== test.expected) {
          throw new Error(`Expected ${test.expected}, but got ${result}`);
        }
      });
    });
  });

  describe('Tests with total results count', () => {
    const itemsOnPage = 15;
    const pages = 2;
    const totalTestItems = itemsOnPage * pages;

    beforeEach(async () => {
      const clothes = [];
      const types = [{ id: 1, name: 'shoes' }];
      const brands = [{ id: 1, name: 'Foo' }];

      for (let i = 1; i <= totalTestItems; i++) {
        // @ts-ignore
        clothes.push({
          id: i, name: 'test', brandId: 1, typeId: 1,
        });
      }

      const arr = [
        { model: Types, values: types },
        { model: Brands, values: brands },
        { model: Clothes, values: clothes },
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

    describe('#getNextPage()', () => {
      it('should return next page link', async () => {
        const tests = [
          { args: 1, expected: '/api/catalog?page=2' },
          { args: 2, expected: '' },
        ];

        tests.forEach(async (test) => {
          const catalog = new CatalogService();
          catalog.page = test.args;
          const result = await catalog.getNextPage();

          expect(result).to.eql(test.expected);
        });
      });
    });

    describe('#getTotal()', () => {
      it('should return total number of clothes', async () => {
        const catalog = new CatalogService();
        const expected = totalTestItems;
        const result = await catalog.getTotal();
        if (result !== expected) {
          throw new Error(`Expected ${expected}, but got ${result}`);
        }
      });
    });

    describe('#countPages()', () => {
      it('should return total number of pages', async () => {
        const expected = pages;
        const catalog = new CatalogService();
        const result = await catalog.countPages();
        if (result !== expected) {
          throw new Error(`Expected ${expected}, but got ${result}`);
        }
      });
    });

    afterEach(async () => {
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
    });
  });

  describe('#sortCondition()', () => {
    it('should return object with field and type properties', () => {
      const tests = [
        { args: 'name-asc', expected: { field: 'name', type: 'ASC' } },
        { args: 'name-desc', expected: { field: 'name', type: 'DESC' } },
        { args: 'default', expected: { field: 'id', type: 'ASC' } },
      ];

      tests.forEach((test) => {
        const catalog = new CatalogService();
        catalog.sort = test.args;
        const res = catalog.getSortParams();
        expect(res).to.eql(test.expected);
      });
    });
  });

  describe('#getAll and /api/catalog route test', () => {
    beforeEach(async () => {
      const clothes = [
        {
          id: 1, name: 'ab tebo error', brandId: 1, typeId: 1,
        },
        {
          id: 2, name: 'TIMBERLAND© BOOT COMPANY 8-INCH SMUGGLERS NOTCH CAP TOE BOOTS', brandId: 2, typeId: 1,
        },
        {
          id: 3, name: 'vivo la vivo', brandId: 1, typeId: 2,
        },
      ];

      const brands = [
        { id: 1, name: 'Foo' },
        { id: 2, name: 'Bar' },
      ];

      const types = [
        { id: 1, name: 'shoes' },
        { id: 2, name: 'dress' },
      ];

      const sizes: Array<Sizes> = [
        { id: 1, value: '44' },
        { id: 2, value: '45' },
        { id: 3, value: 'XL' },
      ];

      const clothSizes = [
        { id: 1, clothId: 1, sizeId: 1 },
        { id: 2, clothId: 1, sizeId: 2 },
        { id: 3, clothId: 2, sizeId: 2 },
        { id: 4, clothId: 3, sizeId: 3 },
      ];

      const arr = [
        { model: Types, values: types },
        { model: Brands, values: brands },
        { model: Clothes, values: clothes },
        { model: Sizes, values: sizes },
        { model: ClothSize, values: clothSizes },
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

    const expected = [
      {
        id: 1, name: 'ab tebo error', brand: { id: 1, name: 'Foo' }, type: { id: 1, name: 'shoes' }, sizes: [{ id: 1, value: '44' }, { id: 2, value: '45' }],
      },
      {
        id: 2, name: 'TIMBERLAND© BOOT COMPANY 8-INCH SMUGGLERS NOTCH CAP TOE BOOTS', brand: { id: 2, name: 'Bar' }, type: { id: 1, name: 'shoes' }, sizes: [{ id: 2, value: '45' }],
      },
      {
        id: 3, name: 'vivo la vivo', brand: { id: 1, name: 'Foo' }, type: { id: 2, name: 'dress' }, sizes: [{ id: 3, value: 'XL' }],
      },
    ];

    describe('#getAll', () => {
      it('should return clothes items and items info', async () => {
        const tests = [
          {
            args: ['timberland smugglers 8', '', '', '', 1],
            expected: [expected[1]],
          },
          {
            args: ['', '', '', 'name-asc', 1],
            expected: [expected[0], expected[1], expected[2]],
          },
          {
            args: ['', '', '', 'name-desc', 1],
            expected: [expected[2], expected[1], expected[0]],
          },
          {
            args: ['dress', '', '44', '', 1],
            expected: [],
          },
          {
            args: ['dress', 'Bar', '44', '', 1],
            expected: [],
          },
        ];

        tests.forEach(async (test) => {
          // @ts-ignore
          const catalog = new CatalogService(test.args[0], test.args[1], test.args[2], test.args[3], test.args[4]);
          const result = await catalog.getLimit();
          expect(result).to.eql(test.expected);
        });
      });
    });

    describe('# GET /api/catalog', () => {
      it('responds with json', (done) => {
        server
          .get('/api/catalog')
          .expect('Content-type', /json/)
          .expect(200)
          .end((err, res) => {
            expect(res.body.items).to.eql(expected);
            if (err) return done(err);
            done();
          });
      });

      it('keyword validation check (should responds with 200 and empty items arr)', (done) => {
        server
          .get('/api/catalog')
          .query({ keyword: '下午好' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.items).to.eql([]);
            if (err) return done(err);
            done();
          });
      });

      it('fulltext index name check (should responds with json)', (done) => {
        server
          .get('/api/catalog')
          .query({ keyword: 'timberland smugglers 8' })
          .expect(200)
          .end((err, res) => {
            expect(res.body.items).to.eql([expected[1]]);
            if (err) return done(err);
            done();
          });
      });

      it('brand validation check (should responds with 200 and empty items arr)', (done) => {
        server
          .get('/api/catalog')
          .query({ brand: "Walsh-ash, Aufderhar and O'Stale" })
          .expect(200)
          .end((err, res) => {
            expect(res.body.items).to.eql([]);
            if (err) return done(err);
            done();
          });
      });

      it('sort validation check (should responds with 422)', (done) => {
        server
          .get('/api/catalog')
          .query({ sort: 'name' })
          .expect(422)
          .end((err, res) => {
            expect(res.body).to.eql([
              {
                value: 'name',
                msg: 'Sort must be default, name-asc or name-desc',
                param: 'sort',
                location: 'query',
              },
            ]);
            if (err) return done(err);
            done();
          });
      });

      it('page validation check (should responds with 422)', (done) => {
        server
          .get('/api/catalog')
          .query({ page: 0 })
          .expect(422)
          .end((err, res) => {
            expect(res.body).to.eql([
              {
                value: '0',
                msg: 'Page must be numeric and start from 1',
                param: 'page',
                location: 'query',
              },
            ]);
            if (err) return done(err);
            done();
          });
      });

      it('page validation check (should responds with 422)', (done) => {
        server
          .get('/api/catalog')
          .query({ page: 'nmn' })
          .expect(422)
          .end((err, res) => {
            expect(res.body).to.eql([
              {
                value: 'nmn',
                msg: 'Page must be numeric and start from 1',
                param: 'page',
                location: 'query',
              },
            ]);
            if (err) return done(err);
            done();
          });
      });

      it('should return 200 and empty items arr', async () => {
        await connection.manager.getRepository(Brands).delete({});
        await connection.manager.getRepository(Types).delete({});
        await connection.manager.getRepository(Clothes).delete({});
        await connection.manager.getRepository(Sizes).delete({});
        await connection.manager.getRepository(ClothSize).delete({});

        return server
          .get('/api/catalog')
          .expect(200)
          .then((res) => {
            expect(res.body.items).to.eql([]);
          });
      });
    });

    afterEach(async () => {
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(ClothSize).delete({});
    });
  });
});
