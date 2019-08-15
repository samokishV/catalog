

exports.up = function(knex) {
    return knex.schema.createTable('clothSizes', function (t) {
        t.increments('id').primary()
        t.integer('clothId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('clothes')
            .onDelete('cascade')
            .onUpdate('cascade')
        t.integer('sizeId')
            .unsigned()
            .notNullable()
            .references('id')
            .inTable('sizes')
            .onDelete('cascade')
            .onUpdate('cascade')    
        t.timestamps(true, true)
      })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('clothSizes')
};