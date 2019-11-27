const articlesRouter = require('express').Router();
const { getArticleById, patchArticle, postComment } = require('../controllers');
const { err405 } = require('../errors');

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle)
    .all(err405);

articlesRouter
    .route('/:article_id/comments')
    .post(postComment)
    .all(err405);

module.exports = articlesRouter;