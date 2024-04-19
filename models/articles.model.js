const db = require("../db/connection");
const { sort } = require("../db/data/test-data/articles");
const { checkExists } = require("../db/seeds/utils");

const selectArticleById = (id) => {
	return db
		.query(
			`SELECT 
	articles.author,
	articles.title,
	articles.article_id,
	articles.body,
	articles.topic,
	articles.created_at,
	articles.votes,
	articles.article_img_url, 
	COUNT (comments.article_id)::INT as comment_count 
	FROM articles 
	LEFT JOIN comments
	ON articles.article_id = comments.article_id
	WHERE articles.article_id=$1
	GROUP BY articles.article_id;`,
			[id]
		)
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, message: "id not found" });
			}
			return rows[0];
		});
};

const selectArticles = ({ topic, sort_by, order }) => {
	if (!sort_by) {
		sort_by = "created_at";
	}

	const validSortbys = [
		"author",
		"title",
		"article_id",
		"topic",
		"created_at",
		"votes",
		"article_img_url",
		"comment_count",
	];
	if (sort_by) {
		if (!validSortbys.includes(sort_by)) {
			return Promise.reject({
				status: 400,
				message: "invalid sort request",
			});
		}
	}

	if (!order) {
		order = "desc";
	}

	const validOrders = ["asc", "desc"];

	if (order) {
		if (!validOrders.includes(order)) {
			return Promise.reject({
				status: 400,
				message: "invalid order request",
			});
		}
	}

	let queryStr = `SELECT 
	articles.author,
	articles.title,
	articles.article_id,
	articles.topic,
	articles.created_at,
	articles.votes,
	articles.article_img_url,
	COUNT (comments.comment_id)::INT as comment_count	
	FROM articles
	LEFT JOIN comments
	ON articles.article_id = comments.article_id
	`;

	if (topic) {
		queryStr += ` WHERE articles.topic= '${topic}' `;
	}

	queryStr += `GROUP BY articles.article_id
	ORDER BY ${sort_by} ${order}`;

	return checkExists("topics", "slug", topic)
		.then(() => {
			return db.query(queryStr + `;`);
		})
		.then(({ rows }) => {
			return rows;
		});
};

const updateArticleVotes = (id, newVotes) => {
	return db
		.query(
			`UPDATE articles 
	SET
	votes = $2  
	WHERE article_id=$1
	RETURNING *;`,
			[id, newVotes]
		)
		.then(({ rows }) => {
			return rows[0];
		});
};

module.exports = { selectArticleById, selectArticles, updateArticleVotes };
