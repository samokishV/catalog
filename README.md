## Docker installation 

cd to api folder and run the container
```
# cd api
# sudo docker-compose up --build
```
run migrations and seeds
```
# sudo docker exec -it myapi /bin/bash
# ./node_modules/.bin/knex migrate:latest --knexfile ./config/knexfile.js
# ./node_modules/.bin/knex seed:run --knexfile ./config/knexfile.js
```

cd to app folder and run the container
```
# cd ../app
# sudo docker-compose up --build
```

## Running tests on docker

```
# sudo docker exec -it myapi /bin/bash
# npm test
```
