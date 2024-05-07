const express = require("express");
const cors = require("cors");

const app = express();

const apiRouter = require("./routes/api-router");

app.use(cors());
app.use(express.json());

app.use("/api", apiRouter);

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
