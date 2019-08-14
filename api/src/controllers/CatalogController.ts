import CatalogService = require('../services/CatalogService');
import { Response, Request, NextFunction } from "express";

export const index = async (req: Request, res: Response) => {
  const page = req.query.p;
  const sort = req.query.sort;
  const items = await CatalogService.getAll(page, sort);
  const total = await CatalogService.getTotal();
  const pageCount = await CatalogService.countPages();
  const nextPage = await CatalogService.getNextPage(page);
  const prevPage = CatalogService.getPrevPage(page);
    
  if(items.length > 0) {
    return res.send({"itemCount": items.length, "total": total, "pageCount": pageCount, "items": items, "previous": prevPage,"next": nextPage});
  }
  
  return res.status(404).send(`Data not found`);
}; 

