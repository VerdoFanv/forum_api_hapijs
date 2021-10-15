const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const RepliesRepository = require('../../Domains/replies/RepliesRepository');

class RepliesRepositoryPostgres extends RepliesRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply({ content, owner }) {
        const id = `reply-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const isDelete = false;

        const query = {
            text: 'INSERT INTO replies VALUES ($1, $2, $3, $4, $5) RETURNING id, content, owner',
            values: [id, content, owner, createdAt, isDelete],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async addReplyToComment(threadId, commentId, replyId) {
        const query = {
            text: 'UPDATE threadcomments SET reply_id = $1 WHERE comment_id = $2 AND reply_id IS NULL',
            values: [replyId, commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            const secQuery = {
                text: 'INSERT INTO threadcomments VALUES ($1, $2, $3)',
                values: [threadId, commentId, replyId],
            };

            await this._pool.query(secQuery);
        }
    }

    async verifyReplyOwner(replyId, userId) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id tidak ditemukan');
        }

        const { owner } = result.rows[0];
        if (owner !== userId) {
            throw new AuthorizationError('anda tidak berhak mengakses resource ini');
        }
    }

    async getRepliesByThreadId(threadId) {
        const query = {
            text: `SELECT replies.id, users.username, replies.created_at, replies.content, replies.is_delete, threadcomments.comment_id FROM threads
                INNER JOIN threadcomments ON threadcomments.thread_id = threads.id
                INNER JOIN replies ON threadcomments.reply_id = replies.id
                INNER JOIN users ON replies.owner = users.id
                WHERE threadcomments.thread_id = $1
                ORDER BY replies.created_at ASC;
            `,
            values: [threadId],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async deleteReplyById(replyId) {
        const query = {
            text: 'UPDATE replies SET is_delete = true WHERE id = $1',
            values: [replyId],
        };

        await this._pool.query(query);
    }
}

module.exports = RepliesRepositoryPostgres;
