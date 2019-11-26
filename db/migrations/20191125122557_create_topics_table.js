exports.up = function(knex) {
    return knex.schema.createTable('topics', (topics) => {
        topics.string('slug').primary();
        topics.text('description').notNullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('topics');
};
