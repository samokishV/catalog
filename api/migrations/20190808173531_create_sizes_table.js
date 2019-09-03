
exports.up = knex => knex.schema.createTable('sizes', (t) => {
  t.increments('id').primary();
  t.string('value').notNullable();
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('sizes');
