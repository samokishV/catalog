import { Response, Request } from 'express';
import * as TypesSizesService from '../services/TypeSizesService';

/**
 * @swagger
 *
 * /api/types/sizes:
 *   get:
 *     description: Find all sizes grouped by type
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful operation
 */
export const index = async (req: Request, res: Response) => {
  const data = await TypesSizesService.getAll();
  return res.send(data);
};
