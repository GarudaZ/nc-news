const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const endpointsSource = require("../endpoints.json");

beforeEach(() => {
	return seed(data);
});
afterAll(() => {
	return db.end();
});

describe("GET/api/topics", () => {
	it("Response has to be 200", () => {
		return request(app).get("/api/topics").expect(200);
	});
	it("returns the correct properties on the correct number of topics", () => {
		return request(app)
			.get("/api/topics")
			.then(({ body }) => {
				expect(body.length).toBe(3);
				body.forEach((topic) => {
					expect(typeof topic.slug).toBe("string");
					expect(typeof topic.description).toBe("string");
				});
			});
	});
});
describe("GET/api", () => {
	it("returns the correct json file containing the endpoint details", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then(({ body }) => {
				expect(body).toEqual(endpointsSource);
			});
	});
});

describe("GET/api/articles/:article_id", () => {
	it("returns a single article by its Id", () => {
		return request(app)
			.get("/api/articles/1")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article.article_id).toEqual(1);
			});
	});
	it("returns any single article by its Id", () => {
		return request(app)
			.get("/api/articles/9")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(article.article_id).toEqual(9);
			});
	});
	it("returns the correct properties", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				expect(typeof article.author).toBe("string");
				expect(typeof article.title).toBe("string");
				expect(typeof article.article_id).toBe("number");
				expect(typeof article.body).toBe("string");
				expect(typeof article.topic).toBe("string");
				expect(typeof article.created_at).toBe("string");
				expect(typeof article.votes).toBe("number");
				expect(typeof article.article_img_url).toBe("string");
			});
	});
	describe("errors for GET /api/articles/:article_id", () => {
		test("returns a 400 bad request when passed incorrect id type", () => {
			return request(app)
				.get("/api/articles/not-a-number")
				.expect(400)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("invalid id type");
				});
		});
		test("returns a 404 not found when passed an id that does not exist", () => {
			return request(app)
				.get("/api/articles/999")
				.expect(404)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("id not found");
				});
		});
	});
});

describe("GET/api/articles", () => {
	it("returns all articles", () => {
		return request(app)
			.get("/api/articles")
			.expect(200)
			.then(({ body }) => {
				expect(body.length).toEqual(13);
			});
	});
	it("all articles are returned with the correct properties", () => {
		return request(app)
			.get("/api/articles")
			.then(({ body }) => {
				body.forEach((article) => {
					expect(typeof article.author).toBe("string");
					expect(typeof article.title).toBe("string");
					expect(typeof article.article_id).toBe("number");
					expect(typeof article.topic).toBe("string");
					expect(typeof article.body).toBe("undefined");
					expect(typeof article.created_at).toBe("string");
					expect(typeof article.votes).toBe("number");
					expect(typeof article.article_img_url).toBe("string");
					expect(typeof article.comment_count).toBe("number");
				});
			});
	});
	it("returns articles sorted in descending age order", () => {
		return request(app)
			.get("/api/articles")
			.then(({ body }) => {
				expect(body).toBeSortedBy("created_at", { descending: true });
			});
	});
	it("returns the correct comment count", () => {
		return request(app)
			.get("/api/articles")
			.then(({ body }) => {
				expect(body[0].comment_count).toBe(2);
				expect(body[12].comment_count).toBe(0);
			});
	});
});

describe("GET/api/articles/:article_id/comments", () => {
	it("returns an empty array for a valid article with no comments", () => {
		return request(app)
			.get("/api/articles/11/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments.length).toEqual(0);
			});
	});
	it("returns an array of comments for a valid article", () => {
		return request(app)
			.get("/api/articles/3/comments")
			.expect(200)
			.then(({ body }) => {
				expect(body.comments.length).toEqual(2);
			});
	});
	it("returns the correct properties", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.expect(200)
			.then(({ body }) => {
				body.comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe("number");
					expect(typeof comment.votes).toBe("number");
					expect(typeof comment.created_at).toBe("string");
					expect(typeof comment.author).toBe("string");
					expect(typeof comment.body).toBe("string");
					expect(typeof comment.article_id).toBe("number");
				});
			});
	});
	it("returns the correct properties values", () => {
		return request(app)
			.get("/api/articles/6/comments")
			.expect(200)
			.then(({ body }) => {
				const comment = body.comments[0];
				expect(comment.comment_id).toBe(16);
				expect(comment.votes).toBe(1);
				expect(typeof comment.created_at).toBe("string");
				expect(comment.author).toBe("butter_bridge");
				expect(comment.body).toBe("This is a bad article name");
				expect(comment.article_id).toBe(6);
			});
	});
	it("returns comments sorted to have most recent first, created_at: desc", () => {
		return request(app)
			.get("/api/articles/1/comments")
			.then(({ body }) => {
				expect(body.comments).toBeSortedBy("created_at", { descending: true });
			});
	});
	describe("errors for GET /api/articles/:article_id/comments", () => {
		it("returns a 400 bad request when passed incorrect id type", () => {
			return request(app)
				.get("/api/articles/not-a-number/comments")
				.expect(400)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("invalid id type");
				});
		});
		it("returns a 404 not found when passed an id that does not exist", () => {
			return request(app)
				.get("/api/articles/999/comments")
				.expect(404)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("id not found");
				});
		});
	});
});

describe("POST /api/articles/:article_id/comments", () => {
	it("POST 201 status code, inserts new comment and responds with posted comment", () => {
		const newComment = {
			username: "butter_bridge",
			body: "This is a new comment",
		};
		return request(app)
			.post("/api/articles/6/comments")
			.send(newComment)
			.expect(201)
			.then(({ body }) => {
				const comment = body.new_comment[0];
				expect(comment.comment_id).toBe(19);
				expect(comment.votes).toBe(0);
				expect(typeof comment.created_at).toBe("string");
				expect(comment.author).toEqual(newComment.username);
				expect(comment.body).toEqual(newComment.body);
				expect(comment.article_id).toBe(6);
			});
	});
	describe("errors for POST /api/articles/:article_id/comments", () => {
		it("returns a 400 bad request when passed incorrect id type", () => {
			const newComment = {
				username: "butter_bridge",
				body: "This is a new comment",
			};
			return request(app)
				.post("/api/articles/not-a-number/comments")
				.send(newComment)
				.expect(400)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("invalid id type");
				});
		});
		it("returns a 404 not found when passed an id that does not exist", () => {
			const newComment = {
				username: "butter_bridge",
				body: "This is a new comment",
			};
			return request(app)
				.post("/api/articles/999/comments")
				.send(newComment)
				.expect(404)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("id not found");
				});
		});
		it("returns a 400 bad request passed request body missing fields", () => {
			const newComment = {
				username: "butter_bridge",
			};
			return request(app)
				.post("/api/articles/6/comments")
				.send(newComment)
				.expect(400)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("400 Bad Request: body missing fields");
				});
		});
		it("returns a 400 bad request when passed a request body with an invalid username", () => {
			const newComment = {
				username: "new_user",
				body: "This is a new comment",
			};
			return request(app)
				.post("/api/articles/6/comments")
				.send(newComment)
				.expect(400)
				.then(({ body }) => {
					const { message } = body;
					expect(message).toBe("invalid username");
				});
		});
	});
});

describe("404 error when passed an invalid endpoint", () => {
	it("Responds with a 404 to invalid endpoint", () => {
		return request(app)
			.get("/api/notARoute")
			.expect(404)
			.then(({ body }) => {
				const { msg } = body;
				expect(msg).toBe("404: Not Found");
			});
	});
});
