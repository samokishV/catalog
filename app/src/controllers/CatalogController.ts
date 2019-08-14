import { Response, Request, NextFunction } from "express";
import Catalog = require('../models/Catalog')

export const index = async (req: Request, res: Response) => {
  const page = req.query.p;
  const sort = req.query.sort;
  const data = await Catalog.findAll(page, sort);
 
  if(data) {
    return res.render("catalog.hbs", {
      items: data.items
    });
  }

  return res.status(404).send(`Page not found`);
}; 