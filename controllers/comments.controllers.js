const selectComments = require("../models/comments.models");
const { selectArticleById } = require("../models/articles.model");

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

module.exports = getComments;
