require('dotenv').config({path: '.env'});

import {createConnection} from "typeorm";
import {Clothes} from "./src/models/Clothes";
import {Brands} from "./src/models/Brands";
import {Types} from "./src/models/Types";
import {Sizes} from "./src/models/Sizes";
import { ClothToSize } from "./src/models/ClothToSizes";

export const connect = async () => await createConnection({
  "type": "mysql",
  "host": process.env.DB_HOST,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.DB_NAME,
  "synchronize": false,
  "logging": false,
  "entities": [
      Clothes,
      Brands,
      Types,
      Sizes,
      ClothToSize
  ]
}).catch(err => console.log(err));






