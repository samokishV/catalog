import 'mocha';
import { expect } from 'chai';
import { getConnection} from 'typeorm';
import { Brands } from '../src/models/Brands';
import  BrandService = require('../src/services/BrandService');
import mysql = require('../connection');

describe("BrandService Tests", function() {
    describe("#getAll()", function() {

        const brands = [{id: 1, name: "Foo"}, {id:2, name : "Bar"}, {id: 3, name: "Rizz"}, {id: 4, name: "Rak"}];
        let expected : Array<Brands>;

        before(async () => {
            await mysql.connect();
            const connection = await getConnection('test');
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

        it("should return array of brand objects", async () => {
            const result = await BrandService.getAll();
            expect(result).to.eql(expected);
        });
    });
});