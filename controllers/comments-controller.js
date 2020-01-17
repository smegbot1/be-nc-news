const { 
    createComment,
    fetchCommentsByArticleId,
    updateCommentVotes,
    removeComment
} = require('../models');

exports.postComment = (req, res, next) => {
    createComment(req.params.article_id, req.body)
        .then(([comment]) => res.status(201).send({ comment }))
        .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.params.article_id, req.query)
        .then(([comments, comment_count]) => res.send({comments, comment_count}))
        .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params.comment_id, req.body)
        .then(([comment]) => res.send({ comment }))
        .catch(next);
};

exports.deleteComment = (req, res, next) => {
    removeComment(req.params.comment_id)
        .then(() => res.sendStatus(204))
        .catch(next);
};