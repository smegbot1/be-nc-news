const commentsRouter = require('express').Router();
const { patchCommentVotes } = require('../controllers');
const { err405 } = require('../errors');

commentsRouter
    .route('/:comment_id')
    .patch(patchCommentVotes)
    .all(err405);

module.exports = commentsRouter;