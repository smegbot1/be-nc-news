const client = require('../db');

exports.fetchArticleById = article_id => {
    return client('articles')
        .select('articles.*')
        .count({ comment_count: 'comment_id' })
        .leftJoin('comments', 'comments.article_id', 'articles.article_id')
        .groupBy('articles.article_id')
        .where('articles.article_id', article_id)
        .then(article => {
            if (article.length === 0) return Promise.reject({ status: 404, msg: 'Article not found.'});
            else return article;
        });
};

exports.updateArticle = (article_id, { inc_votes }) => {
    if (typeof (inc_votes) !== 'number' && inc_votes !== undefined) return Promise.reject({ status: 400, msg: 'Bad request.' });
    return client('articles')
        .increment('votes', inc_votes || 0)
        .then(() => client('articles')
            .select('articles.*')
            .count({ comment_count: 'comment_id' })
            .leftJoin('comments', 'comments.article_id', 'articles.article_id')
            .groupBy('articles.article_id')
            .where('articles.article_id', article_id))
        .then(article => article.length === 0 ?
            Promise.reject({ status: 404, msg: 'Article not found.'}) :
            article);
};

exports.fetchArticles = ({ sort_by, order, author, topic }) => {
    if (!(order === 'desc' || order === 'asc') && order) return Promise.reject({ status: 400, msg: 'Query can only take ascending or descending order.' });
    return verifyUser(author)
        .then(userVeri => userVeri.length === 0 ? Promise.reject({ status: 404, msg: 'Author not found.'}) : verifyTopic(topic))
        .then(topicVeri => topicVeri.length === 0 ? 
            Promise.reject({ status: 404, msg: 'Topic not found.'}) :
            client('articles')
                .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
                .count({ comment_count: 'comment_id' })
                .leftJoin('comments', 'comments.article_id', 'articles.article_id')
                .groupBy('articles.article_id')
                .orderBy(sort_by || 'created_at', order || 'desc')
                .modify(query => author ? query.where('articles.author', author) : query)
                .modify(query => topic ? query.where('articles.topic', topic) : query));
};


// Assisting model functions
function verifyUser (username) {
    return client('users')
        .modify(query => username ? query.select('*').where({username}) : query);
};

function verifyTopic (slug) {
    return client('topics')
        .modify(query => slug ? query.select('*').where({slug}) : query);
};