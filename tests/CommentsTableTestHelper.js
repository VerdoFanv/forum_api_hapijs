/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
        id = 'comment-123',
        content = 'komentar saya',
        owner = 'user-123',
        isDelete = false,
    }) {
        const createdAt = new Date().toISOString();
        const likeCount = 0;
        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6)',
            values: [id, content, owner, createdAt, isDelete, likeCount],
        };

        await pool.query(query);
    },
    async findCommentById(commentId = 'comment-123') {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM comments WHERE 1=1');
    },
};

module.exports = CommentsTableTestHelper;
