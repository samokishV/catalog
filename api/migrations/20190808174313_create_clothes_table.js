
exports.up = knex => knex.schema.createTable('clothes', (t) => {
  t.increments('id').primary();
  t.string('name').notNullable();
  t.integer('brandId')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('brands')
    .onDelete('cascade')
    .onUpdate('cascade');
  t.integer('typeId')
    .unsigned()
    .notNullable()
    .references('id')
    .inTable('types')
    .onDelete('cascade')
    .onUpdate('cascade');
  t.timestamps(true, true);
});

exports.down = knex => knex.schema.dropTableIfExists('clothes');
