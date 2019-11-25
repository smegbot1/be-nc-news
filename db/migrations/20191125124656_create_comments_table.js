exports.up = function(knex) {
    console.log('UP comments table');
    return knex.schema.createTable('comments', (comments) => {
        comments.increment('comment_id').primary();
        comments.string('author').references('users.username');
        comments.integer('article_id').references('articles.article_id');
        comments.integer('votes').defaultTo(0);
        comments.timestamp('created_at').defaultTo(knex.fn.now());
        comments.text('body').notNullable();
    })
};

exports.down = function(knex) {
    console.log('DOWN comments table');
    return knex.schema.dropTable('comments');
};
