
exports.up = (knex) => knex.schema.alterTable('clothes', (t) => {  
    t.index(['name'], 'clothes_name');         
});

exports.down = (knex) => knex.schema.alterTable('clothes', (t) => {
    t.dropIndex(['name'], 'clothes_name');     
});
