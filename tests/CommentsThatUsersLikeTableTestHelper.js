/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsThatUsersLikeTableTestHelper = {
    async addUserToComment({
        commentId = 'comment-123',
        userId = 'user-123',
    }) {
        const query = {
            text: 'INSERT INTO commentsthatuserslike VALUES ($1, $2)',
            values: [commentId, userId],
        };

        await pool.query(query);
    },
    async findUserToCommentByCommentId(commentId = 'comment-123') {
        const query = {
            text: 'SELECT * FROM commentsthatuserslike WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE commentsthatuserslike WHERE 1=1');
    },
};

module.exports = CommentsThatUsersLikeTableTestHelper;
