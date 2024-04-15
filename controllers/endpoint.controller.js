const readEndpoints = require("../models/endpoints.model");

const getEndpoints = (req, res, next) => {
	readEndpoints().then((endpoints) => {
		// const parsedData = JSON.parse(data);
		// console.log(typeof parsedData);
		res.status(200).send({ endpoints });
	});
};

module.exports = getEndpoints;
