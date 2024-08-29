const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`);
};

exports.fetchApiDocs = () => {
    try {
        const docs = require("../endpoints.json");
        return docs;
    } catch (error) { console.log(error); };
};