const { fetchTopics } = require('./topics-model');
const { fetchUserByUsername } = require('./users-model');
const { fetchArticleById, updateArticle, fetchArticles } = require('./articles-model');
const { createComment, fetchCommentsByArticleId, updateCommentVotes, removeComment } = require('./comments-model');

module.exports = {
    fetchTopics,
    fetchUserByUsername,
    fetchArticleById,
    updateArticle,
    createComment,
    fetchCommentsByArticleId,
    fetchArticles,
    updateCommentVotes,
    removeComment
};