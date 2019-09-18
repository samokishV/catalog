import { Response, Request } from 'express';
import { validationResult } from 'express-validator';
import { CatalogService } from '../services/CatalogService';

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
 *       422:
 *         description: validation errors
 */
export const index = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).send(errors.array());
  }

  const page = req.query.page || 1;
  const { sort } = req.query || 'default';
  const { keyword }  = req.query;
  const { brand } = req.query;
  const { size } = req.query;
  const catalog = new CatalogService(keyword, brand, size, sort, page);
  const items = await catalog.getLimit();
  const total = await catalog.getTotal();
  const pageCount = await catalog.countPages();
  const nextPage = await catalog.getNextPage();
  const prevPage = catalog.getPrevPage();

  return res.send({
    itemCount: items.length, total, pageCount, items, previous: prevPage, next: nextPage,
  });
};
