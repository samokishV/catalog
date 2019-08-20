import express = require('express');
import bodyParser = require('body-parser');
import CatalogController = require('./src/controllers/CatalogController');
import TypesSizesController = require('./src/controllers/TypesSizesController');
import BrandsController = require('./src/controllers/BrandsController');

export const start = (app: express.Application) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  require('express-reverse')(app);

  app.get('/api/catalog', CatalogController.index);
  app.get('/api/types/sizes', TypesSizesController.index);
  app.get('/api/brands', BrandsController.index);
};
