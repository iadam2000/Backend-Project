require('jest-extended');
const app = require('../app/app');
const request = require("supertest");
const db = require("../db/connection");
const endpoint = require('../endpoints.json');
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index");

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

describe("GET /api/articles/:article_id", () => {
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
    test("Should return a 400 for invalid article_id", () => {
        return request(app)
            .get("/api/articles/banana")  // Invalid article_id
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Invalid article ID");
            });
    });
});

describe("GET /api/articles", () => {
    test("Should return an array of articles with relevant columns and status 200", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                expect(Array.isArray(articles)).toBe(true);
                expect(articles.length).toBeGreaterThan(0);
                articles.forEach(article => {
                    expect(article).toHaveProperty("author");
                    expect(article).toHaveProperty("title");
                    expect(article).toHaveProperty("article_id");
                    expect(article).toHaveProperty("topic");
                    expect(article).toHaveProperty("created_at");
                    expect(article).toHaveProperty("votes");
                    expect(article).toHaveProperty("article_img_url");
                });
            });
    });
    test("Should include a comment count property", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                articles.forEach(article => expect(article).toHaveProperty("comment_count"));
            });
    });
    test("Articles should be sorted in ascending date order", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].created_at <= articles[i + 1].created_at).toBe(true);
                }

            });
    });
    test("Should not contain body property in any of the articles", () => {
        return request(app)
            .get("/api/articles")
            .expect(200)
            .then(({ body }) => {
                const { articles } = body;
                body.articles.forEach(article => expect(article).not.toHaveProperty("body"));
            });
    });
    test("Should contain relevant columns", () => {
        return request(app)
            .get("/api/articles")
            .then(({ body }) => {
                body.articles.forEach(article => {
                    expect(article).toHaveProperty("author");
                    expect(article).toHaveProperty("title");
                    expect(article).toHaveProperty("article_id");
                    expect(article).toHaveProperty("topic");
                    expect(article).toHaveProperty("created_at");
                    expect(article).toHaveProperty("votes");
                    expect(article).toHaveProperty("article_img_url");
                    expect(article).toHaveProperty("comment_count");
                });
            });
    });
    test("Invalid id should return a 404", () => {
        return request(app)
            .get("/api/articlez")
            .expect(404);
    });
});

describe("GET /api/articles/:article_id/comments", () => {
    test("200: should return an array of comments for the given article_id, sorted by date descending", () => {
        return request(app)
            .get("/api/articles/1/comments")
            .expect(200)
            .then(({ body }) => {
                const { comments } = body;
                expect(Array.isArray(comments)).toBe(true);
                expect(comments.length).toBeGreaterThan(0);

                comments.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id");
                    expect(comment).toHaveProperty("votes");
                    expect(comment).toHaveProperty("created_at");
                    expect(comment).toHaveProperty("author");
                    expect(comment).toHaveProperty("body");
                    expect(comment).toHaveProperty("article_id", 1);
                });

                for (let i = 1; i < comments.length; i++) {
                    expect(comments[i].created_at > comments[0].created_at);
                }
            });
    });
    test("400: should return a 400 error when passed an invalid article_id", () => {
        return request(app)
            .get("/api/articles/not-a-number/comments")
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid article id");
            });
    });



});

describe("POST/api/articles/:article_id/comments", () => {
    test("201: responds with the posted comment when valid data is provided", () => {
        const newComment = {
            username: "butter_bridge",
            body: "This is an insightful article. Thanks for sharing!"
        };
        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(201)
            .then(({ body }) => {
                const { comment } = body;
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes", 0);
                expect(comment).toHaveProperty("created_at");
                expect(comment).toHaveProperty("author", "butter_bridge");
                expect(comment).toHaveProperty("body", "This is an insightful article. Thanks for sharing!");
                expect(comment).toHaveProperty("article_id", 1);
            });
    });
    test("400: responds with an error when the request body is missing required fields", () => {
        const newComment = {
            username: "cooljmessy"
            // Missing 'body'
        };

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: 'username' and 'body' are required fields");
            });
    });
    test("404: responds with an error when the article_id does not exist", () => {
        const newComment = {
            username: "cooljmessy",
            body: "This article does not exist, but I am trying to comment."
        };

        return request(app)
            .post("/api/articles/999999/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("Article not found");
            });
    });
    test("404: responds with an error when the username does not exist", () => {
        const newComment = {
            username: "nonexistentuser",  // This user does not exist in the users table
            body: "This user does not exist, but I am trying to comment."
        };

        return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe("User not found");
            });
    });

    test("400: responds with an error when article_id is not a number", () => {
        const newComment = {
            username: "cooljmessy",
            body: "This article_id is invalid."
        };

        return request(app)
            .post("/api/articles/not-a-number/comments")
            .send(newComment)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: Invalid article_id");
            });
    });
});

describe("PATCH /api/articles/:article_id", () => {
    test('200: should respond with the updated article when a valid vote increment is provided', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body }) => {
                expect(body.article).toEqual(
                    expect.objectContaining({
                        article_id: 1,
                        votes: expect.any(Number),
                    })
                );
            });
    });
    test('200: should decrement votes when a negative value is provided', () => {
        return seed(testData).then(() => {
            return request(app)
                .patch('/api/articles/1')
                .send({ inc_votes: -2 })
                .expect(200)
                .then(({ body }) => {
                    expect(body.article.votes).toBe(98);
                });
        });
    });
    test('400: should respond with an error when article_id is not a number', () => {
        return request(app)
            .patch('/api/articles/not-a-number')
            .send({ inc_votes: 1 })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request: Invalid article_id');
            });
    });
    test('400: should respond with an error when inc_votes is not a number', () => {
        return request(app)
            .patch('/api/articles/1')
            .send({ inc_votes: "not-a-number" })
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe("Bad Request: 'inc_votes' must be a number");
            });
    });
    test('404: should respond with an error when article_id does not exist', () => {
        return request(app)
            .patch('/api/articles/999999')
            .send({ inc_votes: 1 })
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article not found');
            });
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    test('204: should delete the comment and return no content', () => {
        return seed(testData).then(() => {
            return request(app)
                .delete('/api/comments/3')
                .expect(204);
        });
    });


    test('404: should respond with an error if comment_id does not exist', () => {
        return request(app)
            .delete('/api/comments/999999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Comment not found');
            });
    });

    test('400: should respond with an error if comment_id is not valid', () => {
        return request(app)
            .delete('/api/comments/not-a-number')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request: Invalid comment_id');
            });
    });
});

describe("GET /api/users", () => {
    test('200: should respond with an array of users', () => {
        return request(app)
            .get('/api/users')
            .expect(200)
            .then(({ body }) => {
                expect(Array.isArray(body.users)).toBe(true);
                body.users.forEach(user => {
                    expect(user).toHaveProperty('username');
                    expect(user).toHaveProperty('name');
                    expect(user).toHaveProperty('avatar_url');
                });
            });
    });
    test('404: should respond with not found when the route does not exist', () => {
        return request(app)
            .get('/api/userz') // Note the typo in the endpoint
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('404 - Endpoint not found');
            });
    });
});

describe("GET /api/articles?sort_by=&order=", () => {
    test("Should return a list of articles ordered by date descending with a 200 status when no sorting or order specified", () => {
        return request(app)
            .get("/api/articles?sort_by=&order=")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].created_at >= articles[i + 1].created_at).toBe(true);
                }
            });
    });
    test("Should return sorted by specified list in default (desc) and 200", () => {
        return request(app)
            .get("/api/articles?sort_by=title")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].title >= articles[i + 1].title).toBe(true);
                }
            });
    });
    test("Should return sorted by specified list in default (desc) and 200", () => {

        return request(app)
            .get("/api/articles?sort_by=votes")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].votes >= articles[i + 1].votes).toBe(true);
                }
            });

    });
    test("Should return sorted list by specified column and specified order and 200", () => {
        return request(app)
            .get("/api/articles?sort_by=votes&order=asc")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].votes <= articles[i + 1].votes).toBe(true);
                }
            });
    });
    test("Should return created_at by default when not specified with specified order and 200", () => {
        return request(app)
            .get("/api/articles?order=asc")
            .expect(200)
            .then(({ body }) => {
                const articles = body.articles;
                for (let i = 0; i < articles.length - 1; i++) {
                    expect(articles[i].created_at <= articles[i + 1].created_at).toBe(true);
                }
            });
    });
    test('400: returns an error for an invalid sort_by column', async () => {
        const { body } = await request(app)
            .get('/api/articles?sort_by=invalid_column')
            .expect(400);
        expect(body.msg).toBe('Invalid sort_by column');
    });
    test('400: returns an error for an invalid order value', async () => {
        const { body } = await request(app)
            .get('/api/articles?sort_by=created_at&order=invalid_order')
            .expect(400);

        expect(body.msg).toBe('Invalid order value');
    });
});
