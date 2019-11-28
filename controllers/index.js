const { getTopics } = require('./topics-controller');
const { getUserByUsername } = require('./users-controller');
const { getArticleById, patchArticle, getArticles } = require('./articles-controller');
const { postComment, getCommentsByArticleId, patchCommentVotes, deleteComment } = require('./comments-controller');

module.exports = {
    getTopics,
    getUserByUsername,
    getArticleById,
    patchArticle,
    postComment,
    getCommentsByArticleId,
    getArticles,
    patchCommentVotes,
    deleteComment
};