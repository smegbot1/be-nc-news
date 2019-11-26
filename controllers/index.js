const { getTopics } = require('./topics-controller');
const { getUserByUsername } = require('./users-controller');
const { getArticleById } = require('./articles-controller')

module.exports = {
    getTopics,
    getUserByUsername,
    getArticleById
};