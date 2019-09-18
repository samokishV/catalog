import express from 'express';
import * as mysql from './services/connection';

import * as route from './route';

require('dotenv').config({ path: '.env' });
require('express-group-routes');

export const app = express();

const port: number = parseInt(String(process.env.PORT), 10);
const host = process.env.HOST;

mysql.connect();
route.start(app);
app.listen(port, host, () => {});
