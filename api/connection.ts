import {createConnection} from "typeorm";
import {Clothes} from "./src/models/Clothes";
import {Brands} from "./src/models/Brands";
import {Types} from "./src/models/Types";
import {Sizes} from "./src/models/Sizes";

export const connect = async () => await createConnection({
  "type": "mysql",
  "host": "localhost",
  "username": "samokish",
  "password": "qwerty",
  "database": "catalog",
  "synchronize": false,
  "logging": false,
  "entities": [
      Clothes,
      Brands,
      Types,
      Sizes
  ]
}).catch(err => console.log(err));






