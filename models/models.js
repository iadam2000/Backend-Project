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

exports.fetchArticles = (sort_by, order, topic) => {

    const allowedSortColumns = ["article_id", "created_at", "title", "votes", "author", "topic", "article_img_url"];
    const allowedSortOrders = ["asc", "desc"];

    // Ensure specified sort_by and order are valid
    if (sort_by !== undefined && sort_by !== "") {
        if (!allowedSortColumns.includes(sort_by)) {
            return Promise.reject({ status: 400, msg: "Invalid sort_by column" });
        }
    }
    if (order !== undefined && order !== "") {
        if (!allowedSortOrders.includes(order)) {
            return Promise.reject({ status: 400, msg: "Invalid order value" });
        }
    }

    // Default case
    let sortColumn = "created_at";
    let sortOrder = "desc";

    if (allowedSortColumns.includes(sort_by)) { sortColumn = sort_by; }
    if (allowedSortOrders.includes(order)) { sortOrder = order; }

    // Case 1 - nothing requested - return sorted by date ascending
    if (sort_by === undefined && order === undefined) {
        sortColumn = "created_at";
        sortOrder = "asc";
    }

    // Case 2 - sort_by specified but order unspecified
    if ((sort_by !== "" && sort_by !== undefined) && (order === undefined || order === "")) {
        sortOrder = "desc";
    }

    // Case 3 - sort_by unspecified but order specified
    if ((sort_by === undefined || sort_by === "") && (order !== undefined && order !== "")) {
        sortColumn = "created_at";
    }

    let query =
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
    `;

    if (topic !== undefined) {
        if (typeof topic !== 'string') {
            return Promise.reject({ status: 400, msg: "Invalid topic" });
        }
        query += `WHERE a.topic = '${topic}' `;
    }

    query += `GROUP BY
    a.article_id,
    a.title,
    a.topic,
    a.author,
    a.created_at,
    a.votes,
    a.article_img_url
    ORDER BY ${sortColumn} ${sortOrder};`;


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
            return { comments: rows };
        });
};

exports.insertCommentByArticleId = (article_id, { username, body }) => {
    const query = `INSERT INTO comments (article_id, author, body, votes, created_at)
         VALUES ($1, $2, $3, 0, NOW())
         RETURNING comment_id, votes, created_at, author, body, article_id;`;

    return db.query(query, [article_id, username, body])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
    return db.query(
        `UPDATE articles
         SET votes = votes + $1
         WHERE article_id = $2
         RETURNING *;`,
        [inc_votes, article_id]
    )
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.removeCommentById = (comment_id) => {
    return db.query('DELETE FROM comments WHERE comment_id = $1 RETURNING *;', [comment_id]);
};

exports.fetchUsers = () => {
    return db.query(`SELECT * FROM users`)
        .then(data => {
            return { users: data.rows };
        });
};