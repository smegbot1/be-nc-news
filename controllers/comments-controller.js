const { createComment, fetchCommentsByArticleId, updateCommentVotes } = require('../models');

exports.postComment = (req, res, next) => {
    createComment(req.params.article_id, req.body)
        .then(([comment]) => res.status(201).send({ comment }))
        .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
    fetchCommentsByArticleId(req.params.article_id, req.query)
        .then(comments => res.send({comments}))
        .catch(next);
};

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params.comment_id, req.body)
        .then(([comment]) => res.status(201).send({ comment }))
        .catch(next);
};