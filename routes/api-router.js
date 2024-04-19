const apiRouter = require("express").Router();
const getEndpoints = require("../controllers/endpoint.controller");
const getTopics = require("../controllers/topics.controllers");
const articlesRouter = require("./articles-router");
const usersRouter = require("./users-router");
const { deleteCommentById } = require("../controllers/comments.controllers");

apiRouter.get("/", getEndpoints);

apiRouter.get("/topics", getTopics);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/users", usersRouter);

apiRouter.delete("/comments/:comment_id", deleteCommentById);

module.exports = apiRouter;
