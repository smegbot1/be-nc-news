// Error handlers middleware
exports.customErr = (err, req, res, next) => {
    if (err.status) res.status(err.status).send({ msg: err.msg });
    else next(err);
};

exports.err400 = (err, req, res, next) => {
    const lib = ['22P02', '23502'];
    if (lib.includes(err.code)) res.status(400).send({ msg: 'Bad request.' });
    else next(err);
};

exports.err422 = (err, req, res, next) => {
    const lib = ['23503'];
    if (lib.includes(err.code)) res.status(422).send({ msg: 'Unprocessable request.'});
    else next(err);
};

exports.err500 = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal server error. Fix your code!'});
};

// Error controller fuctions
exports.err404 = (req, res, next) => {
    res.status(404).send({ msg: 'Path not found, please enter an existing path.'})
};

exports.err405 = (req, res, next) => {
    res.status(405).send({ msg: 'Invalid HTTP method used. Be reasonable man!' });
};

exports.username400 = (req, res, next) => {
    res.status(400).send({ msg: 'Invalid username.' });
};