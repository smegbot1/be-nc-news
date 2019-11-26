const articlesRouter = require('express').Router();
const { getArticleById } = require('../controllers');
const { err405 } = require('../errors');

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .all(err405);

module.exports = articlesRouter;