const { selectUsers, selectUserByName } = require("../models/users.models");

const getUsers = (req, res, next) => {
	selectUsers().then((users) => {
		res.status(200).send({ users: users });
	});
};

const getUserByName = (req, res, next) => {
	const { username } = req.params;
	selectUserByName(username)
		.then((user) => {
			res.status(200).send({ user: user });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = { getUserByName, getUsers };
