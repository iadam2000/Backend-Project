const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            return rows; 
        });
};

exports.fetchApiDocs = () => {
        const docs = require("../endpoints.json");
        return docs;
};