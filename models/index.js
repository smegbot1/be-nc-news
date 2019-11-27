const { fetchTopics } = require('./topics-model');
const { fetchUserByUsername } = require('./users-model');
const { fetchArticleById, updateArticle } = require('./articles-model');
const { createComment, fetchCommentsByArticleId } = require('./comments-model');

module.exports = {
    fetchTopics,
    fetchUserByUsername,
    fetchArticleById,
    updateArticle,
    createComment,
    fetchCommentsByArticleId
};