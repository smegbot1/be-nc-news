const client = require('../db');

exports.fetchArticleById = article_id => {
    return client('articles')
        .select('articles.*')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', article_id);
};