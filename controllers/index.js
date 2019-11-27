const { getTopics } = require('./topics-controller');
const { getUserByUsername } = require('./users-controller');
const { getArticleById, patchArticle } = require('./articles-controller')

module.exports = {
    getTopics,
    getUserByUsername,
    getArticleById,
    patchArticle
};