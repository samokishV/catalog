const requestify = require('requestify'); 

export const findAll = (page:number, sort:string) => {
  let params;
  
  if(sort === undefined) params = `p=${page}`;
  else params = `p=${page}&sort=${sort}`;

  return requestify
  .get(`http://localhost:1000/api/catalog?${params}`)
  .then(response => response.getBody())
}
