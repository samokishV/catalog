

exports.up = knex => knex.schema.createTable('clothSizes', (t) => {
  t.increments('id').primary();
  t.integer('clothId')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('clothes')
    .onDelete('cascade')
    .onUpdate('cascade');
  t.integer('sizeId')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('sizes')
    .onDelete('cascade')
    .onUpdate('cascade');
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('clothSizes');
