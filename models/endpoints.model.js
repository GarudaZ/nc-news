const db = require("../db/connection");
const fs = require("fs/promises");
const endpoints = require("../endpoints.json");

const readEndpoints = () => {
	return endpoints;
};

module.exports = readEndpoints;
