const db = require("../db/connection");
const articles = require('../db/data/development-data/articles');

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(data => {
            return { topics: data.rows };
        });
};

exports.fetchApiDocs = () => {
    const docs = require("../endpoints.json");
    return docs;
};

exports.fetchArticleById = (id) => {
    const query = `SELECT * FROM articles WHERE article_id = ${id}`;
    return db.query(query)
        .then((data) => {
            return { article: data.rows };
        });
};