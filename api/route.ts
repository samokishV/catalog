import { swaggerSpec } from './swaggerSpec';
import { options } from './swaggerDocument';
import express from 'express';
import bodyParser from 'body-parser';
import * as CatalogController from './src/controllers/CatalogController';
import * as TypesSizesController from './src/controllers/TypesSizesController';
import * as BrandsController from './src/controllers/BrandsController';
import * as MainController from './src/controllers/MainController';
import swaggerUi from 'swagger-ui-express';
import * as SearchCatalogRequest from './src/requests/searchCatalogRequest';

const { RouteManager } = require('express-shared-routes');
const listEndpoints = require('express-list-endpoints');

export const routes = new RouteManager();
export let endpoints: Array <object>;

export const start = (app: express.Application) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/api', MainController.index);
  routes.get({ name: 'catalog', re: '/api/catalog' }, SearchCatalogRequest.validate, CatalogController.index);
  routes.get({ name: 'type-sizes', re: '/api/types/sizes' }, TypesSizesController.index);
  routes.get({ name: 'brands', re: '/api/brands' }, BrandsController.index);

  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, options));

  routes.applyRoutes(app);
  endpoints = listEndpoints(app);
};
