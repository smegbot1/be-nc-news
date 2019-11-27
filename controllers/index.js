const { getTopics } = require('./topics-controller');
const { getUserByUsername } = require('./users-controller');
const { getArticleById, patchArticle } = require('./articles-controller');
const { postComment, getCommentsByArticleId } = require('./comments-controller');

module.exports = {
    getTopics,
    getUserByUsername,
    getArticleById,
    patchArticle,
    postComment,
    getCommentsByArticleId
};