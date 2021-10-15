const CommentsRepository = require('../../Domains/comments/CommentsRepository');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');

class CommentsRepositoryPostgres extends CommentsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment({ content, owner }) {
        const id = `comment-${this._idGenerator()}`;
        const createdAt = new Date().toISOString();
        const isDelete = false;
        const likeCount = 0;

        const query = {
            text: 'INSERT INTO comments VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, content, owner',
            values: [id, content, owner, createdAt, isDelete, likeCount],
        };

        const { rows } = await this._pool.query(query);
        return rows[0];
    }

    async deleteComment(commentId) {
        const isDelete = true;
        const query = {
            text: 'UPDATE comments SET is_delete = $1 WHERE id = $2',
            values: [isDelete, commentId],
        };

        await this._pool.query(query);
    }

    async verifyCommentOwner(commentId, owner) {
        const query = {
            text: 'SELECT id, owner FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id tidak ditemukan');
        }

        const { owner: commentOwner } = result.rows[0];
        if (owner !== commentOwner) {
            throw new AuthorizationError('anda tidak berhak atas resource ini!');
        }
    }

    async verifyCommentAvaibility(commentId) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('id komentar tidak ditemukan');
        }
    }

    async addCommentToThread(threadId, commentId) {
        const query = {
            text: 'INSERT INTO threadcomments VALUES ($1, $2)',
            values: [threadId, commentId],
        };

        await this._pool.query(query);
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.created_at, comments.content, comments.is_delete, comments.like_count FROM threads
                INNER JOIN threadcomments ON threadcomments.thread_id = threads.id
                INNER JOIN comments ON threadcomments.comment_id = comments.id
                INNER JOIN users ON comments.owner = users.id
                WHERE threadcomments.thread_id = $1
                ORDER BY comments.created_at ASC
            `,
            values: [threadId],
        };

        const { rows } = await this._pool.query(query);
        return rows;
    }

    async checkAvailablityCommentWhatUserLike(commentId, userId) {
        const query = {
            text: 'SELECT user_id FROM commentsthatuserslike WHERE comment_id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            return false;
        }

        const { user_id } = result.rows[0];
        if (user_id !== userId) {
            return false;
        }

        return true;
    }

    async findCommentByThreadId(threadId, commentId) {
        const query = {
            text: 'SELECT * FROM threadcomments WHERE thread_id = $1 AND comment_id = $2',
            values: [threadId, commentId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('thread atau comment id tidak ditemukan');
        }
    }

    async addUserToComment(commentId, userId) {
        const query = {
            text: 'INSERT INTO commentsthatuserslike VALUES ($1, $2)',
            values: [commentId, userId],
        };

        await this._pool.query(query);
    }

    async deleteUserToComment(commentId) {
        const query = {
            text: 'DELETE FROM commentsthatuserslike WHERE comment_id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async editLikecountComment(commentId) {
        const query = {
            text: 'UPDATE comments SET like_count = like_count + 1 WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }

    async editLikedcountComment(commentId) {
        const query = {
            text: 'UPDATE comments SET like_count = like_count - 1 WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    }
}

module.exports = CommentsRepositoryPostgres;
