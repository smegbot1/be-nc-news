const client = require('../db');

exports.fetchUserByUsername = username => {
    return client('users')
        .select('*')
        .where('username', username)
        .then(user => {
            if (user.length === 0) return Promise.reject({status: 404, msg: 'Username not found.'});
            else return user;
        });
};