const db = require("../db/connection");

const selectComments = (article_id) => {
	return db
		.query(
			`SELECT * FROM comments WHERE article_id=$1 ORDER BY created_at DESC`,
			[article_id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

const insertComment = (id, postBody) => {
	const { username, body } = postBody;
	return db
		.query(
			`INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;`,
			[username, body, id]
		)
		.then(({ rows }) => {
			return rows;
		});
};

const deleteComment = (id) => {
	return db.query(
		`DELETE FROM comments
	WHERE comment_id=$1`,
		[id]
	);
};

module.exports = { selectComments, insertComment, deleteComment };
