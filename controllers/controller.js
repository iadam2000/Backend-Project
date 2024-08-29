const { fetchTopics, fetchApiDocs } = require('../models/models');

exports.getTopics = (req, res) => {
    fetchTopics().then(data => {
        return res.status(200).send({topics: data.rows});
    })
        .catch(err => { res.status(500).send({ msg: "Internal Server Error" }); });
};

exports.getApiDocs = (req, res) => {
    return res.status(200).send({ docs: fetchApiDocs() });
};