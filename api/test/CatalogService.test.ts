import 'mocha';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Clothes } from '../src/models/Clothes';

import CatalogService = require('../src/services/CatalogService');
import mysql = require('../connection');
import * as dotenv from 'dotenv';

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

  describe.only('Tests with total results count', () => {
    let clothes: Array<Clothes> = [];
    const itemsOnPage = 15;
    const pages = 2;
    const totalTestItems = itemsOnPage * pages;

    before(async () => {
      await mysql.connect();
      const connection = await getConnection('test');
      await connection.manager.getRepository(Clothes).delete({});

      clothes = [];

      for (let i = 1; i <= totalTestItems; i++) {
        // @ts-ignore
        clothes.push({
          id: i, name: 'test', brandId: 1, typeId: 1,
        });
      }

      await connection.manager
        .createQueryBuilder()
        .insert()
        .into(Clothes)
        .values(clothes)
        .execute();
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
});
