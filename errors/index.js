


// Error controller fuctions
exports.err404 = (req, res, next) => {
    res.status(404).send({ msg: 'Path not found, please enter an existing path.'})
};

exports.err405 = (req, res, next) => {
    res.status(405).send({ msg: 'Invalid HTTP method used. Be reasonable man!' });
};