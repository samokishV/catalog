## Docker installation 

cd to api folder, create config from example and adjust it, run the container
```
# cd api
# cp .env.example .env
# sudo docker-compose up --build
```
run migrations and seeds
```
# sudo docker exec -it myapi /bin/bash
# ./node_modules/.bin/knex migrate:latest --knexfile ./config/knexfile.js
# ./node_modules/.bin/knex seed:run --knexfile ./config/knexfile.js
```

cd to app folder, create config from example and adjust it and run the container
```
# cd ../app
# cp .env.example .env
# sudo docker-compose up --build
```

## Running tests on docker

```
# sudo docker exec -it myapi /bin/bash
# npm test
```
