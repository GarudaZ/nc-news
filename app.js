const express = require("express");
const getTopics = require("./controllers/topics.controllers");
const getEndpoints = require("./controllers/endpoint.controller");
const {
	getComments,
	postComment,
} = require("./controllers/comments.controllers");
const {
	getArticlesBeId,
	getArticles,
} = require("./controllers/articles.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

app.get("/api/articles/:article_id", getArticlesBeId);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id/comments", getComments);

app.post("/api/articles/:article_id/comments", postComment);

app.use((err, req, res, next) => {
	if (err.code === "22P02") {
		res.status(400).send({ message: "invalid id type" });
	}
	if (err.code === "23503") {
		res.status(400).send({ message: "invalid username" });
	}
	next(err);
});

app.use((err, req, res, next) => {
	if (err.status && err.message) {
		res.status(err.status).send({ message: err.message });
	}
	next(err);
});

app.all("*", (request, response, next) => {
	response.status(404).send({ msg: "404: Not Found" });
});

module.exports = app;
