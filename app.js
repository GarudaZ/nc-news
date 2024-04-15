const express = require("express");
const getTopics = require("./controllers/topics.controllers");
const getEndpoints = require("./controllers/endpoint.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api", getEndpoints);

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
