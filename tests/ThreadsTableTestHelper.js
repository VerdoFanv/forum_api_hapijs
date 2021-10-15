/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
        id = 'thread-123',
        title = 'sebuah thread',
        body = 'thread saya',
        owner = 'user-123',
    }) {
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5)',
            values: [id, title, body, owner, createdAt],
        };

        await pool.query(query);
    },
    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.created_at, users.username FROM threads
                LEFT JOIN users ON users.id = threads.owner
                WHERE threads.id = $1
            `,
            values: [threadId],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },
    async findThreadById(threadId) {
        const query = {
            text: 'SELECT * from threads WHERE id = $1',
            values: [threadId],
        };

        const result = await pool.query(query);
        return result.rows[0];
    },
    async cleanTable() {
        await pool.query('DELETE FROM threads WHERE 1=1');
    },
};

module.exports = ThreadsTableTestHelper;
