const _ = require('lodash');

exports.seed = async function (knex, Promise) {
  const fakeClothSizes = [];
  const desiredFakeClothes = 100125;

  const firstClothId = await knex('clothes').offset(0).limit(1)
    .then(result => result[0].id);

  for (let i = 0; i < desiredFakeClothes; i++) {
    const typeId = await knex('clothes').where(function () {
      this.where('id', firstClothId + i);
    }).then(result => result[0].typeId);

    const sizesIds = await knex('typeSizes').where(function () {
      this.where('typeId', typeId);
    }).then((result) => {
      const ids = _.map(result, 'id');
      return ids;
    });

    const sizesLen = sizesIds.length;
    const range = _.range(1, sizesLen, 1);
    const randomSizesLen = _.sample(range);
    const randomSizes = _.sampleSize(sizesIds, randomSizesLen);

    for (let j = 0; j < randomSizesLen; j++) {
      fakeClothSizes.push({ clothId: firstClothId + i, sizeId: randomSizes[j] });
    }
  }

  return knex('clothSizes').del()
    .then(async () => await knex('clothSizes')
      .insert(fakeClothSizes));
};
