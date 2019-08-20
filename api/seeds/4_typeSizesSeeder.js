const _ = require('lodash');
const { typeSizes } = require('../seedsData.js');

exports.seed = async function (knex, Promise) {
  const fakeTypeSizes = [];
  const keys = _.keys(typeSizes);

  for (let i = 0; i < keys.length; i++) {
    const typeId = await knex('types').where(function () {
      this.where('name', keys[i]);
    }).then(result => result[0].id);

    for (let j = 0; j < typeSizes[keys[i]].length; j++) {
      const sizeId = await knex('sizes').where(function () {
        this.where('value', typeSizes[keys[i]][j]);
      }).then(result => result[0].id);

      fakeTypeSizes.push({ typeId, sizeId });
    }
  }

  return knex('typeSizes').del()
    .then(async () => {
      await knex('typeSizes')
        .insert(fakeTypeSizes);
    });
};
