const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadsRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(newThread) {
        const { title, body, owner } = newThread;
        const id = `thread-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const query = {
            text: 'INSERT INTO threads VALUES ($1, $2, $3, $4, $5) RETURNING id, title, owner',
            values: [id, title, body, owner, createdAt],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async getThreadById(threadId) {
        const query = {
            text: `SELECT threads.id, threads.title, threads.body, threads.created_at AS date, users.username FROM threads
                LEFT JOIN users ON users.id = threads.owner
                WHERE threads.id = $1
            `,
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id tidak ditemukan');
        }

        return result.rows[0];
    }

    async verifyThreadAvaibility(threadId) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id tidak ditemukan');
        }
    }
}

module.exports = ThreadRepositoryPostgres;
