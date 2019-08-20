
exports.up = function (knex) {
  return knex.schema.createTable('types', (t) => {
    t.increments('id').primary();
    t.string('name').notNullable();
    t.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('types');
};
