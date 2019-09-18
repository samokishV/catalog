const faker = require('faker');

const createFakeBrand = () => ({
  name: faker.company.companyName(),
});

exports.seed = async function (knex, Promise) {
  const fakeBrands = [];
  let fakeBrand;
  const desiredFakeBrands = 100;
  for (let i = 0; fakeBrands.length < desiredFakeBrands; i++) {
    fakeBrand = createFakeBrand();

    if (!fakeBrands.includes(fakeBrand)) {
      fakeBrands.push(fakeBrand);
    }
  }

  await knex('brands')
    .insert(fakeBrands);
};
