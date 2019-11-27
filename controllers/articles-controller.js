const { fetchArticleById } = require('../models');

exports.getArticleById = (req, res, next) => {
    fetchArticleById(req.params.article_id)
        .then(([article]) => {
            console.log('inside the on fulfilement callback...')
            // console.log(article)
            res.send({article});
        })
        .catch(next);
};