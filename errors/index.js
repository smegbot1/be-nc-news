exports.err404 = (req, res, next) => {
    res.status(404).send({ msg: 'Path not found, please enter an existing path.'})
}