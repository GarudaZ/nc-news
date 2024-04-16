const readEndpoints = require("../models/endpoints.model");

const getEndpoints = (req, res, next) => {
	const test = readEndpoints();
	res.status(200).send(test);
};

module.exports = getEndpoints;
