
exports.up = (knex) => knex.schema.alterTable('brands', (t) => {  
    t.index(['name'], 'brands_name');         
});

exports.down = (knex) => knex.schema.alterTable('brands', (t) => {
    t.dropIndex(['name'], 'brands_name');     
});
