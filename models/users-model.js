const client = require('../db');

exports.fetchUserById = user_id => {
    return client('users')
        .select('*')
        .where({user_id});
};