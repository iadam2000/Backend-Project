const {
    fetchTopics,
    fetchApiDocs,
    fetchArticleById,
    fetchArticles,
    fetchCommentsById,
    insertCommentByArticleId,
    updateArticleVotes
} = require('../models/models');

exports.getTopics = (req, res) => {
    fetchTopics().then(data => {
        return res.status(200).send(data);
    });
};

exports.getApiDocs = (req, res) => {
    return res.status(200).send({ docs: fetchApiDocs() });
};

exports.getArticleById = (req, res) => {
    if (isNaN(req.params.article_id)) return res.status(400).send({ msg: "Invalid article ID" });
    fetchArticleById(req.params.article_id).then(data => {
        if (data.article.length === 0) return res.status(404).send({ msg: "Article not found" });
        return res.status(200).send(data);
    });
};

exports.getArticles = (req, res) => {
    fetchArticles().then(data => {
        return res.status(200).send(data);
    });
};

exports.getCommentsById = (req, res) => {
    if (isNaN(req.params.article_id)) return res.status(400).send({ msg: "Bad Request: Invalid article id" });
    fetchCommentsById(req.params.article_id).then(data => {
        return res.status(200).send(data);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;

    if (!username || !body) {
        return res.status(400).send({ msg: "Bad Request: 'username' and 'body' are required fields" });
    }

    insertCommentByArticleId(article_id, { username, body })
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

exports.patchArticleById = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;

    if (isNaN(Number(article_id))) {
        return res.status(400).send({ msg: 'Bad Request: Invalid article_id' });
    }

    if (typeof inc_votes !== 'number') {
        return res.status(400).send({ msg: "Bad Request: 'inc_votes' must be a number" });
    }
    updateArticleVotes(article_id, inc_votes)
        .then((updatedArticle) => {
            if (!updatedArticle) {
                return res.status(404).send({ msg: "Article not found" });
            }
            res.status(200).send({ article: updatedArticle });
        })
        .catch(next);
};