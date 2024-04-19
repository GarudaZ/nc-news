const apiRouter = require("express").Router();
const getEndpoints = require("../controllers/endpoint.controller");
const getTopics = require("../controllers/topics.controllers");
const articlesRouter = require("./articles-router");
const getUsers = require("../controllers/users.controllers");
const { deleteCommentById } = require("../controllers/comments.controllers");

apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.get("/users", getUsers);

apiRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = apiRouter;
