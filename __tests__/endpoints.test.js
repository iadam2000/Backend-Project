const app = require('../app/app');
const request = require("supertest");
const db = require("../db/connection");
const endpoint = require('../endpoints.json');
afterAll(() => db.end());

describe("GET /api/topics", () => {
    test("Retrieve topics from test database, should respond with 200 and an array", () => {
        return request(app)
            .get("/api/topics")
            .expect(200)
            .then(response => {
                expect(response.body.topics.length).toBeGreaterThan(0);
                response.body.topics.forEach(topic => {
                    expect(topic).toHaveProperty("slug");
                    expect(topic).toHaveProperty("description");
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
                expect(data.body.docs).toMatchObject(endpoint);
            });
    });
});

describe.only("GET /api/articles/:article_id", () => {
    test("Should return an object containing data relevant to article_id", () => {
        return request(app)
            .get("/api/articles/3")
            .expect(200)
            .then(({ body }) => {
                const article = body.article[0];
                expect(article).toHaveProperty("article_id", 3);
                expect(article).toHaveProperty("title");
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("body");
                expect(article).toHaveProperty("topic");
                expect(article).toHaveProperty("created_at");
                expect(article).toHaveProperty("votes");
                expect(article).toHaveProperty("article_img_url");
            });
    });
    test("Should return a 404 for non-existent article_IDs", () => {
        return request(app)
            .get("/api/articles/124122412")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });

})

