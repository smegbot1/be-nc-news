const client = require('../db');

exports.fetchArticleById = article_id => {
    return client('articles')
        .select('*')
        .where('article_id', article_id);
};