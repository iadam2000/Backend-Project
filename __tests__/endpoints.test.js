const app = require('../app/app');
const request = require("supertest");
const db = require("../db/connection");

afterAll(() => db.end());

describe("CORE: GET /api/topics", () => {
    test("Retrieve topics from test database, should respond with 200 and an array", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body.topics)).toBe(true);
            })
            .catch(err => { throw err; });
    });
    test("Should respond with 404 for an invalid endpoint", () => {
        return request(app)
            .get("/api/invalidURL")
            .expect(404);
    });
});
