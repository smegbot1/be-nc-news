const client = require('../db');

exports.fetchArticleById = article_id => {
    return client('articles')
        .select('articles.*')
        .count({ comment_count: 'comment_id' })
        // .count('comment_id as comment_count')
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', article_id)
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article not found.'});
            else return article;
        });
};

exports.updateArticle = (article_id, { inc_votes }) => {
    return client('articles')
        .increment('votes', inc_votes)
        .where({ article_id })
        .returning('*');
};