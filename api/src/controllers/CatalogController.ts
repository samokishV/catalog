import CatalogService = require('../services/CatalogService');
import { Response, Request, NextFunction } from "express";

/**
 * @OA\Post(
 *     path="/api/catalog",
 *     tags={"clothes"},
 *     operationId="index",
 *     summary="Finds all clothes in catalog",
 *     description="",
 *     @OA\Parameter(
 *         description="Catalog page",
 *         in="query",
 *         name="page",
 *         required=false,
 *         @OA\Schema(
 *              type="integer"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Sort type",
 *         in="query",
 *         name="sort",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Search string",
 *         in="query",
 *         name="keyword",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Clothes brand",
 *         in="query",
 *         name="brand",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Clothes size",
 *         in="query",
 *         name="size",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="successful operation",
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Data not found",
 *     ),
 * )
 */
export const index = async (req: Request, res: Response) => {
  const page = req.query.page || 1;
  const sort = req.query.sort;
  const keyword = req.query.keyword;
  const brand = req.query.brand;
  const size = req.query.size;
  const items = await CatalogService.getAll(keyword, brand, size, sort, page);
  const total = await CatalogService.getTotal();
  const pageCount = await CatalogService.countPages();
  const nextPage = await CatalogService.getNextPage(page);
  const prevPage = CatalogService.getPrevPage(page);
    
  if(items.length > 0) {
    return res.send({"itemCount": items.length, "total": total, "pageCount": pageCount, "items": items, "previous": prevPage,"next": nextPage});
  }
  
  return res.status(404).send(`Data not found`);
}; 

