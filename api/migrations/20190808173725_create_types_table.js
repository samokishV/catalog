
exports.up = knex => knex.schema.createTable('types', (t) => {
  t.increments('id').primary();
  t.string('name').notNullable();
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('types');
