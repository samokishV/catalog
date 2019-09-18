
exports.up = knex => knex.schema.alterTable('sizes', (t) => {
  t.index(['value'], 'sizes_value');
});

exports.down = knex => knex.schema.alterTable('sizes', (t) => {
  t.dropIndex(['value'], 'sizes_value');
});
