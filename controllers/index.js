const { getTopics } = require('./topics-controller');
const { getUserByUsername } = require('./users-controller');

module.exports = {
    getTopics,
    getUserByUsername
};