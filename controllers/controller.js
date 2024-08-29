const {
    fetchTopics,
    fetchApiDocs,
    fetchArticleById
} = require('../models/models');

exports.getTopics = (req, res) => {
    fetchTopics().then(data => {
        return res.status(200).send({ topics: data });
    });
};

exports.getApiDocs = (req, res) => {
    return res.status(200).send({ docs: fetchApiDocs() });
};

exports.getArticleById = (req, res) => {
    fetchArticleById(req.params.article_id).then(data => {
        if (data.article.length === 0) return res.status(404).send({ msg: "Article not found" });
        return res.status(200).send(data);
    });
};