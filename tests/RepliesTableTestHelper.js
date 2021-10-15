/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
        id = 'reply-123',
        content = 'balasan saya',
        owner = 'user-123',
    }) {
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO replies VALUES ($1, $2, $3, $4)',
            values: [id, content, owner, createdAt],
        };

        await pool.query(query);
    },
    async findReplyById(replyId = 'reply-123') {
        const query = {
            text: 'SELECT * FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('DELETE FROM replies WHERE 1=1');
    },
};

module.exports = RepliesTableTestHelper;
