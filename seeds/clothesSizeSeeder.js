const faker = require("faker");

exports.seed = async function(knex, Promise) {
    const fakeSizes = [];
    const sizes = ['S', 'M', 'L'];
    for(let i = 0; i < sizes.length; i++) {
        fakeSizes.push({value: sizes[i]});
    }

    await knex("clothesSize")
        .insert(fakeSizes)
}