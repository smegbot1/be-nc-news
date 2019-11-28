const { readFile } = require('fs');

exports.getEndpoints = (req, res, next) => {
    return readFile('./endpoints.json', 'utf8', (err, file) => {
        const endpoints = JSON.parse(file);
        if (err) next(err)
        else res.send({ endpoints });
    });
};