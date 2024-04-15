const express = require("express");
const getTopics = require("./controllers/topics.controllers");

const app = express();

app.get("/api/topics", getTopics);

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
