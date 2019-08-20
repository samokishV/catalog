const requestify = require('requestify');

export const findAll = () => requestify
  .get('http://localhost:1000/api/brands')
  .then(response => response.getBody());
