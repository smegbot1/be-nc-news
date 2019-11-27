const articlesRouter = require('express').Router();
const { 
    getArticleById,
    patchArticle,
    postComment,
    getCommentsByArticleId,
    getArticles
} = require('../controllers');
const { err405 } = require('../errors');

articlesRouter
    .route('/')
    .get(getArticles)
    .all(err405);

articlesRouter
    .route('/:article_id')
    .get(getArticleById)
    .patch(patchArticle)
    .all(err405);

articlesRouter
    .route('/:article_id/comments')
    .get(getCommentsByArticleId)
    .post(postComment)
    .all(err405);

module.exports = articlesRouter;