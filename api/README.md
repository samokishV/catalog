# Catalog API

## Installation

Create config from example and adjust it.

```
# cp .env.example .env
```
Run migrations and seeds.

```
# knex migrate:latest --knexfile ./config/knexfile.js
# knex seed:run --knexfile ./config/knexfile.js
```

Download and unzip Elasticsearch
Run bin/elasticsearch

Download and unzip Logstash 
Change config files in ./config/logstash
Run bin/logstash -f path/to/logstash/config/file

## Running tests

Run migrations and tests.

```
# knex migrate:latest --knexfile ./config/knexfile-test.js
# npm test
```
