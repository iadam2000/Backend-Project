const { fetchTopics } = require('../models/models');

exports.getTopics = (req, res, next) => {
    fetchTopics().then(data => {
        return res.status(200).send({ topics: data });
    })
    .catch(next);
};