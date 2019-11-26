const client = require('../db');

exports.fetchTopics = () => {
    return client('topics')
        .select('*');
};