const _ = require('lodash');

const shoesSizes = _.range(35, 46, 1);
const dressSizes = ['S', 'M', 'L'];

exports.typeSizes = { shoes: shoesSizes, dress: dressSizes };
