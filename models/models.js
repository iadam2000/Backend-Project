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
        .then(data => {
            return { article: data.rows };
        });
};

exports.fetchArticles = () => {

    const query =
        `
    SELECT
    a.article_id,
    a.title,
    a.topic,
    a.author,
    a.created_at,
    a.votes,
    a.article_img_url,
    COUNT(c.comment_id) AS comment_count  
FROM
    articles a
LEFT JOIN
    comments c
ON
    a.article_id = c.article_id
GROUP BY
    a.article_id,
    a.title,
    a.topic,
    a.author,
    a.created_at,
    a.votes,
    a.article_img_url
    ORDER BY a.created_at;
    `;

    return db.query(query)
        .then(data => {
            return { articles: data.rows };
        });
};

exports.fetchCommentsById = (id) => {
    const query = `
            SELECT comment_id, votes, created_at, author, body, article_id
            FROM comments
            WHERE article_id = $1
            ORDER BY created_at DESC;
            `;
    return db.query(query, [id])
        .then(({ rows }) => {
            return {comments: rows};
        });
};