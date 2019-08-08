
exports.up = function(knex) {
    return knex.schema.createTable('sizes', function (t) {
        t.increments('id').primary()
        t.string('value').notNullable()
        t.timestamps(true, true)
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sizes')
};
