const {
    getTopics,
    getApiDocs
} = require('../controllers/controller');

const express = require("express");
const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getApiDocs);

app.use((req, res) => {
    res.status(404).send({ msg: "404 - Endpoint not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack); 
    res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;