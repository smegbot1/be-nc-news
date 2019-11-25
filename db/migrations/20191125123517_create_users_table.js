exports.up = function(knex) {
    console.log('UP users table');
    return knex.schema.createTable('users', (users) => {
        users.string('username').primary();
        users.string('avatar_url').notNullable();
        users.string('name').notNullable();
    })
};

exports.down = function(knex) {
    console.log('DOWN users table');
    return knex.schema.dropTable('users');
};
