import express = require('express');
import bodyParser = require('body-parser');
import CatalogController = require('./src/controllers/CatalogController'); 
import expressHbs = require('express-handlebars');

export const start = (app: express.Application) => {
    app.use(bodyParser.urlencoded({ extended: false }));

    app.engine('hbs', expressHbs({
        layoutsDir: __dirname + '/src/views/layouts',
        defaultLayout: 'layout',
        extname: 'hbs',
      }));

    app.set('views', __dirname + '/src/views');  
    app.set('view engine', 'hbs');

    app.get("/catalog", CatalogController.index);
    app.post("/catalog", CatalogController.index);
};
