const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const { forEach } = require("../db/data/test-data/articles");
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
				// console.log(body.endpoints);
				const parsedText = JSON.parse(body.endpoints);
				expect(parsedText).toEqual(endpointsSource);
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
				console.log(body);
				expect(article.article_id).toEqual(9);
			});
	});
	it("returns the correct properties", () => {
		return request(app)
			.get("/api/articles/3")
			.expect(200)
			.then(({ body }) => {
				const article = body.article;
				console.log(article);
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
