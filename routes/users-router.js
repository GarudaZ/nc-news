const usersRouter = require("express").Router();
const { getUsers, getUserByName } = require("../controllers/users.controllers");

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUserByName);

module.exports = usersRouter;
