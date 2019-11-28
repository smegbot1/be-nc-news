const client = require('../db');

exports.createComment = (article_id, { username, body }) => {
    return client('comments')
        .insert({article_id, author: username, body})
        .returning('*');
};

exports.fetchCommentsByArticleId = (article_id, { sort_by, order }) => {
    if (!(order === 'desc' || order === 'asc') && order) return Promise.reject({ status: 400, msg: 'Query can only take ascending or descending order.'} );
    return client('comments')
        .select('comment_id', 'votes', 'created_at', 'author', 'body')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .where({ article_id });
};

exports.updateCommentVotes = (comment_id, { inc_votes }) => {
    return client('comments')
        .select('*')
        .where({ comment_id })
        .then(comment => {
            if (comment.length === 0) return Promise.reject({ status: 404, msg: 'Comment not found.'});
            if (typeof inc_votes !== 'number') return Promise.reject({ status: 400, msg: 'Bad request.' })
            comment[0].votes += inc_votes;
            return comment;
        });
};

exports.removeComment = comment_id => {
    return client('comments')
        .where({ comment_id })
        .del()
        .then(comment => {
            if (comment === 0) return Promise.reject({ status: 404, msg: 'Comment not found.'});
            else return comment;
        });
};