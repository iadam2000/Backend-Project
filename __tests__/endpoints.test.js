const app = require('../app/app');
const request = require("supertest");
const db = require("../db/connection");

afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("Retrieve topics from test database, should respond with 200 and an array", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(response => {
                expect(Array.isArray(response.body.topics)).toBe(true);
                response.body.topics.forEach(topic => {
                    console.log(topic);
                    expect(topic).toHaveProperty("slug");
                    expect(topic).toHaveProperty("description");
                    expect(typeof topic.slug).toBe("string");
                    expect(typeof topic.description).toBe("string");
                });
            });
    });
    test("Should respond with 404 for an invalid endpoint", () => {
        return request(app)
            .get("/api/invalidURL")
            .expect(404);
    });
});

describe("GET /api", () => {
    test("Should return an object containing documentation and a 200 status", () => {
        return request(app)
            .get("/api")
            .expect(200)
            .then(data => {
                const docs = data.body.docs;
                for (let key in docs) {
                    expect(typeof docs[key].exampleResponse).toBe("object");
                    expect(docs[key]).toHaveProperty("description");
                    expect(docs[key]).toHaveProperty("queries");
                    expect(docs[key]).toHaveProperty("exampleResponse");
                    expect(Array.isArray(docs[key].queries)).toBe(true);
                }
            });
    });
});

