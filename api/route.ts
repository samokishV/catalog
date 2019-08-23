import express = require('express');
import bodyParser = require('body-parser');
import CatalogController = require('./src/controllers/CatalogController');
import TypesSizesController = require('./src/controllers/TypesSizesController');
import BrandsController = require('./src/controllers/BrandsController');
import swaggerUi = require('swagger-ui-express');
import {swaggerSpec} from './swaggerSpec';
import {options} from './swaggerDocument';
import SearchCatalogRequest = require('./src/requests/searchCatalogRequest');

export const start = (app: express.Application) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  require('express-reverse')(app);

  app.get('/api/catalog', SearchCatalogRequest.validate, CatalogController.index);
  app.get('/api/types/sizes', TypesSizesController.index);
  app.get('/api/brands', BrandsController.index);

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));
};
