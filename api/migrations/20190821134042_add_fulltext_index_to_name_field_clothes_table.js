
exports.up = knex => knex.schema.raw('CREATE FULLTEXT INDEX `name` ON clothes(`name`)');

exports.down = knex => knex.schema.raw('ALTER TABLE `clothes` DROP INDEX `name`');
