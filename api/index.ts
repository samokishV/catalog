require('dotenv').config({ path: '.env' });
require('express-group-routes');

import mysql = require('./connection');

mysql.connect();

import express = require('express');

export const app = express();

import route = require('./route');

route.start(app);

const port: number = parseInt(String(process.env.PORT), 10);
const host = process.env.HOST;

app.listen(port, host, () => {});

