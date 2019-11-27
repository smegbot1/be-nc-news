const { fetchArticleById, updateArticle, fetchArticles } = require('../models');

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id)
        .then(([article]) => res.send({article}))
        .catch(next);
};

exports.patchArticle = (req, res, next) => {
    updateArticle(req.params.article_id, req.body)
        .then(([article]) => res.status(201).send({article}))
        .catch(next);
};

exports.getArticles = (req, res, next) => {
    fetchArticles()
        .then(articles => res.send({articles}))
        .catch(next);
};