import express from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swaggerSpec';
import { options } from './swaggerDocument';
import * as CatalogController from './controllers/CatalogController';
import * as TypesSizesController from './controllers/TypesSizesController';
import * as BrandsController from './controllers/BrandsController';
import * as MainController from './controllers/MainController';
import * as SearchCatalogRequest from './requests/searchCatalogRequest';

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
