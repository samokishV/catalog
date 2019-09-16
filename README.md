## Docker installation 

cd to api folder and run the container
```
# cd api
# sudo docker-compose up --build
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
