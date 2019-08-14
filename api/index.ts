require('dotenv').config({path: '.env'});
require('express-group-routes');

import mysql = require('./connection');

mysql.connect();

import express = require('express');

const app = express();

import route = require('./route');

route.start(app);

const port: number = parseInt(<string>process.env.PORT, 10);
const host = process.env.HOST;

app.listen(port, host, () => {});