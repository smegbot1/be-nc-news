const util = require('util');
const { readFile } = require('fs');

exports.getEndpoints = (req, res, next) => {
    const read = util.promisify(readFile)
    read('./endpoints.json')
    .then(file => {
        res.send({ endpoints: JSON.parse(file) });
    })
    .catch(next);
};