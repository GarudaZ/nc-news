const { selectComments, insertComment } = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.model");
const { commentData } = require("../db/data/test-data");

const getComments = (req, res, next) => {
	const { article_id } = req.params;
	Promise.all([selectComments(article_id), selectArticleById(article_id)])
		.then(([commentData]) => {
			res.status(200).send({ comments: commentData });
		})
		.catch((err) => {
			next(err);
		});
};

const postComment = (req, res, next) => {
	const { article_id } = req.params;
	const postBody = req.body;
	if (!postBody.body || !postBody.username) {
		res.status(400).send({ message: "400 Bad Request: body missing fields" });
	}
	selectArticleById(article_id)
		.then(() => {
			return insertComment(article_id, postBody);
		})
		.then((addedComment) => {
			res.status(201).send({ new_comment: addedComment });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = { getComments, postComment };
