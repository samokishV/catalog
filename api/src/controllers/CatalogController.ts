import { Response, Request, NextFunction } from 'express';

import CatalogService = require('../services/CatalogService');

/**
 * @swagger
 *
 * /api/catalog:
 *   get:
 *     description: Find all clothes in catalog
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         description: Catalog page.
 *         in: query
 *         required: false
 *         type: integer
 *       - name: sort
 *         description: Sort type.
 *         in: query
 *         required: false
 *         type: string
 *       - name: keyword
 *         description: Search string.
 *         in: query
 *         required: false
 *         type: string
 *       - name: brand
 *         description: Clothes brand.
 *         in: query
 *         required: false
 *         type: string 
 *       - name: size
 *         description: Clothes size.
 *         in: query
 *         required: false
 *         type: string 
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: data not found
 */ 
export const index = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const { sort } = req.query;
  const { keyword } = req.query;
  const { brand } = req.query;
  const { size } = req.query;
  const items = await CatalogService.getAll(keyword, brand, size, sort, page);
  const total = await CatalogService.getTotal();
  const pageCount = await CatalogService.countPages();
  const nextPage = await CatalogService.getNextPage(page);
  const prevPage = CatalogService.getPrevPage(page);

  if (items.length > 0) {
    return res.send({
      itemCount: items.length, total, pageCount, items, previous: prevPage, next: nextPage,
    });
  }

  return res.status(404).send('Data not found');
};
