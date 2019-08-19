import * as dotenv from "dotenv";
dotenv.config({path: '.env'});

import {createConnections} from "typeorm";
import {Clothes} from "./src/models/Clothes";
import {Brands} from "./src/models/Brands";
import {Types} from "./src/models/Types";
import {Sizes} from "./src/models/Sizes";
import { ClothToSize } from "./src/models/ClothToSizes";
import { TypeToSize } from "./src/models/TypeToSizes";

export const connect = async () => await createConnections([{
  "name": "default",
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
      ClothToSize,
      TypeToSize
  ]
}, {
  "name": "test",
  "type": "mysql",
  "host": process.env.DB_HOST,
  "username": process.env.DB_USERNAME,
  "password": process.env.DB_PASSWORD,
  "database": process.env.TEST_DB_NAME,
  "synchronize": false,
  "logging": false,
  "entities": [
      Clothes,
      Brands,
      Types,
      Sizes,
      ClothToSize,
      TypeToSize
  ]
}
]).catch(err => console.log(err));






