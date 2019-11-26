const { fetchTopics } = require('./topics-model');
const { fetchUserByUsername } = require('./users-model');

module.exports = {
    fetchTopics,
    fetchUserByUsername
};