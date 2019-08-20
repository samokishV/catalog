import { Response, Request } from 'express';

const { validationResult } = require('express-validator');

import Catalog = require('../models/Catalog');
import Brand = require('../models/Brand');
import TypeSize = require('../models/TypeSize');
import bootstrapPagination = require('../../helpers/bootstrapPagination');

export const index = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  const page = req.params.page || 1;
  const keyword = req.body.keyword || req.query.keyword;
  const brand = req.body.brand || req.query.brand;
  const size = req.body.size || req.query.size;
  const sort = req.body.order || req.query.sort || 'default';

  let params = '';

  if (sort) params += `?sort=${sort}`;
  if (keyword) params += `&keyword=${keyword}`;
  if (brand) params += `&brand=${brand}`;
  if (size) params += `&size=${size}`;

  let items;
  let paginationHTML;

  if (errors.isEmpty()) {
    const data = await Catalog.findAll(keyword, brand, size, page, sort, params);

    if (data) {
      items = data.items;
      const paginator = bootstrapPagination.create('/catalog/search', page, data.itemCount, data.total, params);
      paginationHTML = paginator.render();
    }
  }

  const brands = await Brand.findAll();
  const typeSizes = await TypeSize.findAll();

  return res.render('catalog.hbs', {
    items,
    brands,
    typeSizes,
    pagination: paginationHTML,
    keyword,
    brand,
    size,
    order: sort,
    errors: errors.errors,
  });
};
