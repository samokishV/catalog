import { Response, Request, NextFunction } from 'express';

import TypesSizesService = require('../services/TypeSizesService');

/**
 * @OA\Get(
 *     path="/api/types/sizes",
 *     summary="Finds all sizes grouped by type",
 *     tags={"types-sizes"},
 *     operationId="index",
 *     @OA\Response(
 *         response=200,
 *         description="successful operation",
 *     ),
 *     @OA\Response(
 *         response="404",
 *         description="Data not found",
 *     ),
 * )
 */
export const index = async (req: Request, res: Response) => {
  const data = await TypesSizesService.getAll();

  if (data.length > 0) {
    return res.send(data);
  }

  return res.status(404).send('Data not found');
};
