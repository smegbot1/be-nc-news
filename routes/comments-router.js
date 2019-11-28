const commentsRouter = require('express').Router();
const { patchCommentVotes, deleteComment } = require('../controllers');
const { err405 } = require('../errors');

commentsRouter
    .route('/:comment_id')
    .patch(patchCommentVotes)
    .delete(deleteComment)
    .all(err405);

module.exports = commentsRouter;