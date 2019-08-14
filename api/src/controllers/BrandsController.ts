import BrandService = require('../services/BrandService');
import { Response, Request, NextFunction } from "express";

export const index = async (req: Request, res: Response) => {
  const data = await BrandService.getAll();
    
  if(data.length > 0) {
    return res.send(data);
  }
  
  return res.status(404).send(`Data not found`);
}; 