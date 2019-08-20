// @ts-ignore
const requestify = require('requestify');

export const findAll = (keyword: string, brand: string, size: string, page: number, sort: string, params: string) => requestify
  .request(`http://localhost:1000/api/catalog${params}&page=${page}`, { method: 'GET' })
  .then(response => response.getBody())
  .catch(err => console.log(err));
