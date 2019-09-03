
exports.up = knex => knex.schema.createTable('typeSizes', (t) => {
  t.increments('id').primary();
  t.integer('typeId')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('types')
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

exports.down = knex => knex.schema.dropTableIfExists('typeSizes');
