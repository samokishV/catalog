import { Response, Request } from 'express';

import MainService = require('../services/MainService');

/**
 * @swagger
 *
 * /api:
 *   get:
 *     description: Find all routes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: data not found
 */
export const index = (req: Request, res: Response) => {
  const data: Array<object> = MainService.getRoutes();
  return res.send({ links: data });
};
