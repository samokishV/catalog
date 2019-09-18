require('dotenv').config({ path: '.env' });
require('express-group-routes');

import * as mysql from './src/services/connection';
import express from 'express';

export const app = express();

import * as route from './route';

const port: number = parseInt(String(process.env.PORT), 10);
const host = process.env.HOST;

mysql.connect();
route.start(app);
app.listen(port, host, () => {});

