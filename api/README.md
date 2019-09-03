# Catalog API

## Installation

Create config from example and adjust it.

```
# cp .env.example .env
```
Run migrations and seeds.

```
# knex migrate:latest
# knex seed:run
```

## Running tests

Change DB_NAME in config .env
Run migrations and tests.

```
# knex migrate:latest
# npm test
```
