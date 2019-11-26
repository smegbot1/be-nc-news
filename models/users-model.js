const client = require('../db');

exports.fetchUserByUsername = username => {
    return client('users')
        .select('*')
        .where('username', username);
};