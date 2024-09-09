const {
    getTopics,
    getApiDocs,
    getArticleById,
    getArticles,
    getCommentsById,
    postCommentByArticleId,
    patchArticleById,
    deleteCommentById,
    getUsers
} = require('../controllers/controller');

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApiDocs);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getCommentsById);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleById);

app.delete('/api/comments/:comment_id', deleteCommentById);

app.get("/api/users", getUsers);


//Error handling below
app.use((req, res) => {
    res.status(404).send({ msg: "404 - Endpoint not found" });
});

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg });
    }  else if (err.code === '23503') {
        // Foreign key violation (e.g., article_id or username does not exist)
        if (err.constraint === 'comments_article_id_fkey') {
            res.status(404).send({ msg: "Article not found" });
        } else if (err.constraint === 'comments_author_fkey') {
            res.status(404).send({ msg: "User not found" });
        }
    } else if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad Request: Invalid article_id' });
    }
    else {
        res.status(500).send({ msg: "Internal Server Error" });
    }
});

module.exports = app;