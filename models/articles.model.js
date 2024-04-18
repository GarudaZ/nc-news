const db = require("../db/connection");
const { checkExists } = require("../db/seeds/utils");

const selectArticleById = (id) => {
	return db
		.query("SELECT * FROM articles WHERE article_id=$1", [id])
		.then(({ rows }) => {
			if (rows.length === 0) {
				return Promise.reject({ status: 404, message: "id not found" });
			}
			return rows[0];
		});
};

const selectArticles = (topic) => {
	// console.log(topic);
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
	ORDER BY created_at DESC`;

	return checkExists("topics", "slug", topic) //could move to controller
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
