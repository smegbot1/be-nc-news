const client = require('../db');

exports.createComment = (article_id, { username, body }) => {
    return client('comments')
        .insert({article_id, author: username, body})
        .returning('*');
};

exports.fetchCommentsByArticleId = (article_id, { sort_by, order }) => {
    return client('comments')
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .where({ article_id });
};