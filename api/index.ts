require('dotenv').config({ path: '.env' });
require('express-group-routes');

const config = require('./knexfile');
const knex = require('knex')(config);

import mysql = require('./connection');
import express = require('express');

export const app = express();

import route = require('./route');

const port: number = parseInt(String(process.env.PORT), 10);
const host = process.env.HOST;

console.log("(1/3) running [knex.migrate.latest()]");
knex.migrate.latest().then(function () {
  console.log("(2/3) running [knex.seed.run()]");
  knex.seed.run().then(function() {
    console.log("(3/3) app ready. Listening");
    mysql.connect();
    route.start(app);
    app.listen(port, host, () => {});
  });
});

