import 'mocha';
import equal = require('deep-equal');
import { getConnection } from 'typeorm';
import { Clothes } from '../src/models/Clothes';

import CatalogService = require('../src/services/CatalogService');
import mysql = require('../connection');

import * as dotenv from 'dotenv';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { ClothToSize } from '../src/models/ClothToSizes';
import { Brands } from '../src/models/Brands';

import chai = require('chai');
import chaiAsPromised = require("chai-as-promised");
import { type } from 'os';

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
        const result = CatalogService.getPrevPage(test.args);
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
      it('should return next page link', () => {
        const tests = [
          { args: 1, expected: `${baseURL}/api/catalog?p=2` },
          { args: 2, expected: '' },
        ];

        tests.forEach(async (test) => {
          const result = await CatalogService.getNextPage(test.args);
          if (result !== test.expected) {
            throw new Error(`Expected ${test.expected}, but got ${result}`);
          }
        });
      });
    });

    describe('#getTotal()', () => {
      it('should return total number of clothes', async () => {
        const expected = totalTestItems;
        const result = await CatalogService.getTotal();
        if (result !== expected) {
          throw new Error(`Expected ${expected}, but got ${result}`);
        }
      });
    });

    describe('#countPages()', () => {
      it('should return total number of pages', async () => {
        const expected = pages;
        const result = await CatalogService.countPages();
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
        const res = CatalogService.sortCondition(test.args);
        expect(res).to.eql(test.expected);
      });
    });
  });

  describe.only('#getAll', () => {

    before(async () => {
      await mysql.connect();
      const connection = await getConnection();
    
      await connection.manager.getRepository(Brands).delete({})
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(ClothToSize).delete({});

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
        {model: ClothToSize, values: clothSizes},
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
          { args: [undefined, undefined, undefined, 'name-asc', undefined], 
            expected: [expected[0], expected[1], expected[2]]
          },
          { args: [undefined, undefined, undefined, 'name-desc', undefined], 
            expected: [expected[2], expected[1], expected[0]]
          },
          { args: ['dress', undefined, '44', undefined, undefined], 
            expected: []
          },
          { args: ['dress', 'Bar', '44', undefined, undefined], 
            expected: []
          },
          { args: ['timberland smugglers 8', undefined, undefined, undefined, undefined], 
            expected: [expected[1]]
          },
        ];

        tests.forEach(async (test) => {
          // @ts-ignore
          let result = await CatalogService.getAll(test.args[0], test.args[1], test.args[2], test.args[3], test.args[4]);
          try {
            expect(result).to.eql(test.expected);
          } catch(e) {
            return done(e);
          }
        });
      });
    });

    after(async () => {
      await mysql.connect();
      const connection = await getConnection();
    
      await connection.manager.getRepository(Brands).delete({});
      await connection.manager.getRepository(Types).delete({});
      await connection.manager.getRepository(Clothes).delete({});
      await connection.manager.getRepository(Sizes).delete({});
      await connection.manager.getRepository(ClothToSize).delete({});
    });
  });
});
