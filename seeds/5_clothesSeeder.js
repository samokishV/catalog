const _ = require("lodash");
const faker = require("faker");
const typeSizes = require("../seedsData.js").typeSizes;

exports.seed = async function(knex, Promise) {
    const fakeClothes = [];
    const desiredFakeClothes = 100125;

    const typeIds = await knex('types').select("id").then(result => {
        const ids = _.map(result, 'id');
        return ids;
    });

    const firstTypeId = _.first(typeIds);
    const lastTypeId = _.last(typeIds); 

    for(let i = 0; i < desiredFakeClothes; i++) {
        fakeClothes.push({name: faker.lorem.words(), brandId: _.random(1, 100), typeId: _.random(firstTypeId, lastTypeId)});
    }

    return knex('clothes').del()
        .then(async () => {
            return await knex("clothes")
                .insert(fakeClothes) 
        });
}