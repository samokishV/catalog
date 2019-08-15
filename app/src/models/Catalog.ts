const requestify = require('requestify'); 

export const findAll = (keyword: string, brand: string, size: string, page:number, sort:string) => {
  return requestify
  .request("http://localhost:1000/api/catalog", {
    method: 'POST',
    body: {
      page: page,
      sort: sort,
      keyword: keyword,
      brand: brand,
      size:size,
    },
    dataType: 'form-url-encoded'
  }).then(response => response.getBody()) 
  .catch(err => console.log(err)) 
}