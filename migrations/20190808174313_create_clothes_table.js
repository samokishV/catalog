
exports.up = function(knex) {
    return knex.schema.createTable('clothes', function (t) {
        t.increments('id').primary()
        t.string('name').notNullable()
        t.integer('brandId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('brands')
            .onDelete('cascade')
            .onUpdate('cascade')
        t.integer('typeId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('types') 
            .onDelete('cascade')
            .onUpdate('cascade')
        t.timestamps(true, true)
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clothes')
};
