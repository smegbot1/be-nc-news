const ENV = process.env.NODE_ENV || 'devData';

const devData = require('./development-data');
const testData = require('./test-data');

const data = {
    devData,
    testData
};

module.exports = data[ENV];