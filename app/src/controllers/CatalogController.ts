const {validationResult} = require('express-validator');
import { Response, Request, NextFunction } from "express";
import Catalog = require('../models/Catalog');
import Brand = require('../models/Brand');
import TypeSize = require('../models/TypeSize');
import pagination = require('pagination');

export const index = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  const page = req.query.page || 1;
  const keyword = req.body.keyword;
  const brand = req.body.brand;
  const size = req.body.size;
  const order = req.body.order;

  let items;

  if (errors.isEmpty()) {
    const data = await Catalog.findAll(keyword, brand, size, page, order);

    if(data) {
      items = data.items;
    }
  }

  const brands = await Brand.findAll();
  const typeSizes = await TypeSize.findAll();
  
  // const paginator = pagination.create('search', {prelink:'/catalog', current: page, rowsPerPage: data.itemCount, totalResult: data.total}); 
 
  return res.render("catalog.hbs", {
    items: items,
    brands: brands,
    typeSizes: typeSizes,
    // pagination: paginator.render(),
    keyword: keyword,
    brand: brand,
    size: size,
    order: order,
    errors: errors.errors
  });
  
}; 
