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
    return this.fetchArticleById(article_id)
        .then(article => {
            if (typeof (inc_votes) !== 'number') return Promise.reject({ status: 400, msg: 'Bad request.' });
            article[0].votes += inc_votes
            return article;
        });
};

exports.fetchArticles = ({ sort_by, order, author, topic }) => {
    if (!(order === 'desc' || order === 'asc') && order) return Promise.reject({ status: 400, msg: 'Query can only take ascending or descending order.' });
    return client('articles')
        .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .orderBy(sort_by || 'created_at', order || 'desc')
        .modify(query => author ? query.where('articles.author', author) : query)
        .modify(query => topic ? query.where('articles.topic', topic) : query)
        .then(data => !topic && data.length === 0 ? Promise.reject({ status: 400, msg: 'Author not found.' }) : data)
        .then(data => topic && data.length === 0 ? Promise.reject({ status: 400, msg: 'Topic not found.' }) : data);
};