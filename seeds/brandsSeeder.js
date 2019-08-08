const faker = require("faker");

const createFakeBrand = () => ({
    name: faker.company.companyName()
})

exports.seed = async function(knex, Promise) {
    const fakeBrands = [];
    const desiredFakeBrands = 100;
    for(let i = 0; i < desiredFakeBrands; i++) {
        fakeBrands.push(createFakeBrand());
    }

    await knex("brands")
        .insert(fakeBrands)
}