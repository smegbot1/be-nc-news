exports.up = function(knex) {
    console.log('UP topics table');
    return knex.schema.createTable('topics', (topics) => {
        topics.string('slug').primary();
        topics.text('description').notNullable();
    });
};

exports.down = function(knex) {
    console.log('DOWN topics table')
    return knex.schema.dropTable('topics');
};
