const client = require('../db');

exports.createComment = (article_id, { username, body }) => {
    return client('comments')
        .insert({article_id, author: username, body})
        .returning('*');
};

exports.fetchCommentsByArticleId = article_id => {
    return client('comments')
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .orderBy('created_at')
        .where({ article_id });
};