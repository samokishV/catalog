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

Run migrations and tests.

```
# knex migrate:latest --knexfile ./knexfile-test.js
# npm test
```
