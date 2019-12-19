const client = require('../db');

exports.fetchArticleById = article_id => {
    return client('articles')
        .select('articles.*')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', article_id)
        .then(article => article.length === 0 ? Promise.reject({ status: 404, msg: 'Article not found.'}) : article);
};

exports.updateArticle = (article_id, { inc_votes }) => {
    if (typeof (inc_votes) !== 'number' && inc_votes !== undefined) return Promise.reject({ status: 400, msg: 'Bad request.' });
    return client('articles')
        .increment('votes', inc_votes || 0)
        .where('articles.article_id', article_id)
        .then(() => client('articles')
            .select('articles.*')
            .count({ comment_count: 'comment_id' })
            .leftJoin('comments', 'comments.article_id', 'articles.article_id')
            .groupBy('articles.article_id')
            .where('articles.article_id', article_id))
        .then(article => article.length === 0 ? Promise.reject({ status: 404, msg: 'Article not found.'}) : article);
};

exports.fetchArticles = ({ sort_by, order, author, topic, limit, offset }) => {
    if (!(order === 'desc' || order === 'asc') && order) return Promise.reject({ status: 400, msg: 'Query can only take ascending or descending order.' });
    return Promise.all([verifyUser(author), verifyTopic(topic)])
        .then(([userVeri, topicVeri]) => {
            if (userVeri.length === 0) return Promise.reject({ status: 404, msg: 'Author not found.' });
            if (topicVeri.length === 0) return Promise.reject({ status: 404, msg: 'Topic not found.' });
            return client('articles')
                .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
                .count({ comment_count: 'comment_id' })
                .leftJoin('comments', 'comments.article_id', 'articles.article_id')
                .groupBy('articles.article_id')
                .orderBy(sort_by || 'created_at', order || 'desc')
                .limit(limit || 5)
                .modify(query => offset && query.offset(offset))
                .modify(query => author && query.where('articles.author', author))
                .modify(query => topic && query.where('articles.topic', topic));
        });
};


function verifyUser (username) {
    return client('users')
        .modify(query => username ? query.select('*').where({username}) : query);
};

function verifyTopic (slug) {
    return client('topics')
        .modify(query => slug ? query.select('*').where({slug}) : query);
};