const _ = require("lodash");
const typeSizes = require("../seedsData.js").typeSizes;

exports.seed = async function(knex, Promise) {
    const fakeTypes = [];
    const types = _.keys(typeSizes);
    for(let i = 0; i < types.length; i++) {
        fakeTypes.push({name: types[i]});
    }

    return knex('types').del()
        .then(async () => {
            await knex("types")
                .insert(fakeTypes)
        });     
}