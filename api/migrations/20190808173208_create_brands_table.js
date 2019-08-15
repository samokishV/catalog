
exports.up = function(knex) {
    return knex.schema.createTable('brands', function (t) {
        t.increments('id').primary()
        t.string('name').notNullable()
        t.timestamps(true, true)
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('brands')
};
