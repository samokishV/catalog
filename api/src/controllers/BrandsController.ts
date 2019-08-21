import { Response, Request, NextFunction } from 'express';

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
 *       404:
 *         description: data not found
 */
export const index = async (req: Request, res: Response) => {
  const data = await BrandService.getAll();

  if (data.length > 0) {
    return res.send(data);
  }

  return res.status(404).send('Data not found');
};
