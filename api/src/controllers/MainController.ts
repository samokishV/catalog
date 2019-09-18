import { Response, Request } from 'express';
import * as MainService from '../services/MainService';

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
 */
export const index = (req: Request, res: Response) => {
  const data: Array<object> = MainService.getRoutes();
  return res.send({ links: data });
};
