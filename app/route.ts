import express = require('express');
import bodyParser = require('body-parser');
import CatalogController = require('./src/controllers/CatalogController');
import expressHbs = require('express-handlebars');
import equalHelper = require('./helpers/equalHelper');
import searchRequest = require('./requests/searchRequest');

export const start = (app: express.Application) => {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.engine('hbs', expressHbs({
    layoutsDir: `${__dirname}/src/views/layouts`,
    defaultLayout: 'layout',
    extname: 'hbs',
    helpers: {
      equal: equalHelper.equal,
    },
  }));

  app.set('views', `${__dirname}/src/views`);
  app.set('view engine', 'hbs');

  app.use(express.static(`${__dirname}/src/public`));

  app.get('/catalog', CatalogController.index);
  app.get('/catalog/search', searchRequest.validate, CatalogController.index);
  app.get('/catalog/search/page/:page', CatalogController.index);
};
