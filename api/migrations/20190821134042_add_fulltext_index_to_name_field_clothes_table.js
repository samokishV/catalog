
exports.up = function(knex) { 
    return knex.schema.raw('CREATE FULLTEXT INDEX `name` ON clothes(`name`)');
};

exports.down = function(knex) {
    return knex.schema.raw('ALTER TABLE `clothes` DROP INDEX `name`');  
};
