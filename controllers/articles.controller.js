const { lock } = require("../app");
const articles = require("../db/data/test-data/articles");
const {
	selectArticleById,
	selectArticles,
} = require("../models/articles.model");

const getArticlesBeId = (req, res, next) => {
	const { article_id } = req.params;

	selectArticleById(article_id)
		.then((article) => {
			res
				.status(200)
				.send({ article })
				.catch((err) => next(err));
		})
		.catch((err) => {
			next(err);
		});
};

const getArticles = (req, res, next) => {
	selectArticles().then((articlesData) => {
		console.log(articlesData);
		res.status(200).send(articlesData);
	});
};

module.exports = { getArticlesBeId, getArticles };
