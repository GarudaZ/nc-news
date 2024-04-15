const seed = require("../db/seeds/seed");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const data = require("../db/data/test-data");
const { forEach } = require("../db/data/test-data/articles");

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
