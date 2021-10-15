/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadCommentsTableTestHelper = {
    async addThreadComments({
        threadId = 'thread-123',
        commentId = 'comment-123',
    }) {
        const query = {
            text: 'INSERT INTO threadcomments VALUES ($1, $2)',
            values: [threadId, commentId],
        };

        await pool.query(query);
    },
    async addCommentReplies({
        threadId = 'thread-123',
        commentId = 'comment-123',
        replyId = 'reply-123',
    }) {
        const query = {
            text: 'INSERT INTO threadcomments VALUES ($1, $2, $3)',
            values: [threadId, commentId, replyId],
        };

        await pool.query(query);
    },
    async getComments(threadId) {
        const query = {
            text: `SELECT comments.id, users.username, comments.created_at, comments.content FROM threads
                INNER JOIN threadcomments ON threadcomments.thread_id = threads.id
                INNER JOIN comments ON threadcomments.comment_id = comments.id
                INNER JOIN users ON comments.owner = users.id
                WHERE threadcomments.thread_id = $1
                ORDER BY comments.created_at ASC
            `,
            values: [threadId],
        };

        const result = await pool.query(query);
        return result.rows;
    },
    async getReplies(threadId) {
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

        const result = await pool.query(query);
        return result.rows;
    },
    async cleanTable() {
        await pool.query('TRUNCATE threadcomments');
    },
};

module.exports = ThreadCommentsTableTestHelper;
