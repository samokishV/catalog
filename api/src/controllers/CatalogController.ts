import CatalogService = require('../services/CatalogService');
import { Response, Request, NextFunction } from "express";

export const index = async (req: Request, res: Response) => {
  console.log(req.body);

  const page = req.body.p || 1;
  const sort = req.body.sort;
  const keyword = req.body.keyword;
  const brand = req.body.brand;
  const size = req.body.size;
  const items = await CatalogService.getAll(keyword, brand, size, page, sort);
  const total = await CatalogService.getTotal();
  const pageCount = await CatalogService.countPages();
  const nextPage = await CatalogService.getNextPage(page);
  const prevPage = CatalogService.getPrevPage(page);
    
  if(items.length > 0) {
    return res.send({"itemCount": items.length, "total": total, "pageCount": pageCount, "items": items, "previous": prevPage,"next": nextPage});
  }
  
  return res.status(404).send(`Data not found`);
}; 

