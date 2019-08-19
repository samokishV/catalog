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
 *         in="body",
 *         name="p",
 *         required=false,
 *         @OA\Schema(
 *              type="integer"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Sort type",
 *         in="body",
 *         name="sort",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Search string",
 *         in="body",
 *         name="keyword",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Clothes brand",
 *         in="body",
 *         name="brand",
 *         required=false,
 *         @OA\Schema(
 *              type="string"
 *          )
 *     ),
 *     @OA\Parameter(
 *         description="Clothes size",
 *         in="body",
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
  console.log(req.body);
  const page = req.body.p || 1;
  const sort = req.body.sort;
  const keyword = req.body.keyword;
  const brand = req.body.brand;
  const size = req.body.size;
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

