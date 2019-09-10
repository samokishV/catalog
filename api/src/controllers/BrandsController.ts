import { Response, Request } from 'express';

import BrandService = require('../services/BrandService');

/**
 * @swagger
 *
 * /api/brands:
 *   get:
 *     description: Find all clothes brands
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 */
export const index = async (req: Request, res: Response) => {
  const data = await BrandService.getAll();
  return res.send(data);
};
