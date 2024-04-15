const db = require("../db/connection");
const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

const readEndpoints = () => {
	return fs.readFile("./endpoints.json", "utf-8").then((endpointDesc) => {
		return endpointDesc;
	});
};

module.exports = readEndpoints;
