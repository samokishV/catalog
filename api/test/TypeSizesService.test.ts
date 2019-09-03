/* eslint-env mocha */
import 'mocha';
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import { Types } from '../src/models/Types';
import { Sizes } from '../src/models/Sizes';
import { TypeToSize } from '../src/models/TypeToSizes';

import TypeSizesService = require('../src/services/TypeSizesService');
import mysql = require('../connection');

describe('TypeSizesService Tests', () => {
  describe('#getAll()', () => {
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

    it('should return array of type objects', async () => {
      const result = await TypeSizesService.getAll();
      expect(result).to.eql(expected);
    });

    after(async () => {
      await mysql.connect();
      const connection = await getConnection();
      connection.manager.getRepository(Types).delete({});
      connection.manager.getRepository(Sizes).delete({});
      connection.manager.getRepository(TypeToSize).delete({});
    });
  });
});
