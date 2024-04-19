const articlesRouter = require("express").Router();
const {
	getComments,
	postComment,
} = require("../controllers/comments.controllers");
const {
	getArticlesById,
	getArticles,
	patchArticleVotesById,
} = require("../controllers/articles.controller");

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticlesById);

articlesRouter
	.route("/:article_id/comments")
	.get(getComments)
	.post(postComment);

articlesRouter.patch("/:article_id", patchArticleVotesById);

module.exports = articlesRouter;
