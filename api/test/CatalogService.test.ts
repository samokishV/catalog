import 'mocha';
import CatalogService = require("../src/services/CatalogService");
import { expect } from 'chai';
import { getConnection } from 'typeorm';
import mysql = require('../connection');
import { Clothes } from '../src/models/Clothes';

describe("CatalogService Tests", function() {

    describe("#getPrevPage()", function() {
        it("should return previous page link", function () {
            const tests = [
                {args: 1, expected: ""},
                {args: 2, expected: "http://localhost:1000/api/catalog?p=1"},
            ];

            tests.forEach(function(test) {
                var result = CatalogService.getPrevPage(test.args);            
                if (result !== test.expected) {
                    throw new Error(`Expected ${test.expected}, but got ${result}`);
                }
            });
        });
    });

    describe.only("Tests with total results count", function() {
        let clothes : Array<Clothes> = [];
        const itemsOnPage = 15;
        const pages = 2;
        const totalTestItems = itemsOnPage*pages;

        before(async () => {
            await mysql.connect();
            const connection = await getConnection('test');
            await connection.manager.getRepository(Clothes).delete({});
            
            clothes = []; 

            for(let i=1; i<=totalTestItems; i++) {
                //@ts-ignore
                clothes.push({id: i, name: 'test', brandId: 1, typeId: 1});
            }

            await connection.manager
                .createQueryBuilder()
                .insert()
                .into(Clothes)
                .values(clothes)
                .execute();
        });

        describe("#getNextPage()", function() {
            it("should return next page link", function () {
                const tests = [
                    {args: 1, expected: "http://localhost:1000/api/catalog?p=2"},
                    {args: 2, expected: ""},
                ];
    
                tests.forEach(async(test) => {
                    var result = await CatalogService.getNextPage(test.args);            
                    if (result !== test.expected) {
                        throw new Error(`Expected ${test.expected}, but got ${result}`);
                    }
                });
            });
        });

        describe("#getTotal()", function() {
            it("should return total number of clothes", async () => {
                const expected = totalTestItems;
                    var result = await CatalogService.getTotal();            
                    if (result !== expected) {
                        throw new Error(`Expected ${expected}, but got ${result}`);
                    }
            });
        });

        describe("#countPages()", function() {
            it("should return total number of pages", async () => {
                const expected = pages;
                    var result = await CatalogService.countPages();            
                    if (result !== expected) {
                        throw new Error(`Expected ${expected}, but got ${result}`);
                    }
            });
        });
    });

    describe("#sortCondition()", function() {
        it("should return object with field and type properties", function () {
            const tests = [
                {args: "name-asc", expected: {field: "name",  type: "ASC"}},
                {args: "name-desc", expected: {field: "name", type: "DESC"}},
                {args: "default", expected: {field: "id", type: "ASC"}}
            ];
    
            tests.forEach(function(test) {
                var res = CatalogService.sortCondition(test.args);
                expect(res).to.eql(test.expected);
            });
        });
    });
});