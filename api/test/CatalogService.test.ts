import 'mocha';
import equal = require('deep-equal');
import { getConnection, Connection, Any } from 'typeorm';
import { Clothes } from '../src/models/Clothes';
import { ClothSize } from '../src/models/ClothSizes';

import {CatalogService} from '../src/services/CatalogService';
import mysql = require('../connection');

import * as dotenv from 'dotenv';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { Brands } from '../src/models/Brands';

import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;
const should = chai.should();

dotenv.config({ path: '.env' });

const baseURL = process.env.APP_BASE_URL;

describe('CatalogService Tests', () => {
  describe('#getPrevPage()', () => {
    it('should return previous page link', () => {
      const tests = [
        { args: 1, expected: '' },
        { args: 2, expected: `${baseURL}/api/catalog?p=1` },
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
    let precondition: Promise<Clothes[]>;

    before(async () => {
      await mysql.connect();
      const connection = await getConnection();
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({});      
      await connection.manager.getRepository(Clothes).delete({});

      let clothes = [];
      const types = [{id: 1, name: 'shoes'}];
      const brands = [{id: 1, name: 'Foo'}];

      for (let i = 1; i <= totalTestItems; i++) {
        // @ts-ignore
        clothes.push({
          id: i, name: 'test', brandId: 1, typeId: 1,
        });
      }

      const arr = [
        {model: Types, values: types},
        {model: Brands, values: brands},
        {model: Clothes, values: clothes},
      ];

      for (let obj of arr) {
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
            { args: 1, expected: `${baseURL}/api/catalog?p=2` },
            { args: 2, expected: '' },
          ];
  
          tests.forEach(async(test) => {
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

    after(async () => {
      await mysql.connect();
      const connection = await getConnection();
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({}); 
      await connection.manager.getRepository(Clothes).delete({});

      precondition = null;
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

  describe('#getAll', () => {

    before(async () => {
      await mysql.connect();
      const connection = await getConnection();
    
      await connection.manager.getRepository(Brands).delete({})
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(ClothSize).delete({});

      const clothes = [
        { id: 1, name: 'ab tebo error', brandId: 1, typeId: 1 },
        { id: 2, name: 'TIMBERLAND© BOOT COMPANY 8-INCH SMUGGLERS NOTCH CAP TOE BOOTS', brandId: 2, typeId: 1 },
        { id: 3, name: 'vivo la vivo', brandId: 1, typeId: 2 },
      ];

      const brands = [
        { id: 1, name: 'Foo' }, 
        { id: 2, name: 'Bar' },
      ];

      const types = [
        { id: 1, name: 'shoes' }, 
        { id: 2, name: 'dress' },
      ];

      const sizes : Array<Sizes> = [
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
        {model: Types, values: types},
        {model: Brands, values: brands},
        {model: Clothes, values: clothes},
        {model: Sizes, values: sizes},
        {model: ClothSize, values: clothSizes},
      ];

      for (let obj of arr) {
        await connection.manager
          .createQueryBuilder()
          .insert()
          .into(obj.model)
          .values(obj.values)
          .execute();
      }
    });

    describe('#getAll', () => {
      it('should return clothes items and items info', (done) => {
        const expected = [
          { id: 1, name: 'ab tebo error', brand: {id:1, name:'Foo'}, type: { id: 1, name: 'shoes' }, sizes: [{ id: 1, value: '44' }, { id: 2, value: '45' }] },
          { id: 2, name: 'TIMBERLAND© BOOT COMPANY 8-INCH SMUGGLERS NOTCH CAP TOE BOOTS', brand: {id:2, name:'Bar'}, type: { id: 1, name: 'shoes' }, sizes: [{ id: 2, value: '45' }] },
          { id: 3, name: 'vivo la vivo', brand: {id:1, name:'Foo'}, type: { id: 2, name: 'dress' }, sizes: [{ id: 3, value: 'XL' }] }
        ];

        const tests = [
          { args: ['', '', '', 'name-asc', 1], 
            expected: [expected[0], expected[1], expected[2]]
          },
          { args: ['', '', '', 'name-desc', 1], 
            expected: [expected[2], expected[1], expected[0]]
          },
          { args: ['dress', '', '44', '', 1], 
            expected: []
          },
          { args: ['dress', 'Bar', '44', '', 1], 
            expected: []
          },
          { args: ['timberland smugglers 8', '', '', '', 1], 
            expected: [expected[1]]
          },
        ];

        tests.forEach(async (test) => {
          // @ts-ignore
          const catalog = new CatalogService(test.args[0], test.args[1], test.args[2], test.args[3], test.args[4]);
          let result = await catalog.getLimit();
          try {
            expect(result).to.eql(test.expected);
          } catch(e) {
            return done(e);
          }
        });

        done();
      });
    });

    after(async () => {
      await mysql.connect();
      const connection = await getConnection();
    
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(ClothSize).delete({});
    });
  });
});
