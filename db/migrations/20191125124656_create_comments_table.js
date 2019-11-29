exports.up = function(knex) {
    return knex.schema.createTable('comments', (comments) => {
        comments.increments('comment_id').primary();
        comments.string('author').references('users.username').notNullable();
        comments.integer('article_id').references('articles.article_id');
        comments.integer('votes').defaultTo(0);
        comments.timestamp('created_at').defaultTo(knex.fn.now());
        comments.text('body').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('comments');
};
