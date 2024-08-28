const db = require("../db/connection");

exports.fetchTopics = () => {
    return db.query(`SELECT * FROM topics`)
        .then(({ rows }) => {
            if (rows.length === 0) {
                // Custom error if no topics are found
                return Promise.reject({
                    status: 404,
                    msg: "No topics found"
                });
            }
            return rows;
        });
};