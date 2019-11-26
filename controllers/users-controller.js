const { fetchUserById } = require('../models');

exports.getUserById = (req, res, next) => {
    const { user_id } = req.params;
    fetchUserById(user_id)
    .then(user => {
        console.log(user)
        res.status(200).send({user})})
    .catch(next);
};