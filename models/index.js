const { fetchTopics } = require('./topics-model');
const { fetchUserByUsername } = require('./users-model');
const { fetchArticleById } = require('./articles-model');

module.exports = {
    fetchTopics,
    fetchUserByUsername,
    fetchArticleById
};