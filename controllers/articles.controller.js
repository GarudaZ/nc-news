const { query } = require("../db/connection");
const articles = require("../db/data/test-data/articles");
const {
	selectArticleById,
	selectArticles,
	updateArticleVotes,
} = require("../models/articles.model");

const getArticlesById = (req, res, next) => {
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
	const { query } = req;
	return selectArticles(query)
		.then((articlesData) => {
			res.status(200).send(articlesData);
		})
		.catch((err) => {
			next(err);
		});
};

const patchArticleVotesById = (req, res, next) => {
	const { article_id } = req.params;
	const { inc_votes } = req.body;
	if (!inc_votes) {
		res.status(400).send({ message: "400 Bad Request: body missing fields" });
	}
	if (typeof inc_votes !== "number") {
		res.status(400).send({ message: "invalid request body" });
	}

	selectArticleById(article_id)
		.then((articleData) => {
			const newVotes = inc_votes + articleData.votes;
			return updateArticleVotes(article_id, newVotes);
		})
		.then((updatedArticle) => {
			res.status(200).send({ updatedArticle });
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = { getArticlesById, getArticles, patchArticleVotesById };
