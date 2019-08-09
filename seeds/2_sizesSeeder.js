const _ = require("lodash");
const typeSizes = require("../seedsData.js").typeSizes;

exports.seed = async function(knex, Promise) {
    const fakeSizes = [];
    const sizes = _.flatten(_.values(typeSizes));

    for(let i = 0; i < sizes.length; i++) {
        fakeSizes.push({value: sizes[i]});
    }

    return knex('sizes')
        .then(async () => {
            knex.raw('SET foreign_key_checks = 0');
            knex.truncate();
            knex.raw('SET foreign_key_checks = 1');

            await knex("sizes").del()
                .insert(fakeSizes)
         });
}