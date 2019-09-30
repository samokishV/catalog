import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import * as Catalog from '../models/Catalog';
import * as Brand from '../models/Brand';
import * as TypeSize from '../models/TypeSize';
import * as bootstrapPagination from '../helpers/bootstrapPagination';
import _ from 'lodash';

export const index = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  const page = req.params.page || 1;
  const keyword = req.query.keyword;
  const brand = req.query.brand;
  const size = req.query.size;
  const sort = req.query.sort || 'default';

  let params = '';

  if (sort) params += `?sort=${sort}`;
  if (keyword) params += `&keyword=${keyword}`;
  if (brand) params += `&brand=${brand}`;
  if (size) params += `&size=${size}`;

  let items;
  let paginationHTML;

  if (errors.isEmpty()) {
    const data = await Catalog.findAll(page, params);

    if (data) {
      items = data.items;
      const paginator = bootstrapPagination.create('/catalog/search', page, 15, data.total, params);
      paginationHTML = paginator.render();

      items.forEach((element: any) => {
        element.sizes = _.sortBy(element.sizes, 'value');
      });
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
    sort,
    errors
  });
};
