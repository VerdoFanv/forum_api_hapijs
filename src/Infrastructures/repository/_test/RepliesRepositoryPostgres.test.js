const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const RepliesRepositoryPostgres = require('../RepliesRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const TruncateAllTableTestHelper = require('../../../../tests/TruncateAllTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('RepliesRepositoryPostgres', () => {
    afterEach(async () => {
        await TruncateAllTableTestHelper.do();
    });

    afterAll(async () => {
        await pool.end();
    });

    it('harus merupakan instance dari RepliesRepository', () => {
        const repliesRepositoryPostgres = new RepliesRepositoryPostgres({});

        expect(repliesRepositoryPostgres).toBeInstanceOf(RepliesRepository);
    });

    describe('addReply method', () => {
        it('harus menambahkan balasan dan membuat object dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const fakeIdGenerator = () => '123';
            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, fakeIdGenerator);

            const addReplyPayload = {
                content: 'sebuah balasan',
                owner: 'user-123',
            };

            const expectedAddedReply = {
                id: 'reply-123',
                content: addReplyPayload.content,
                owner: addReplyPayload.owner,
            };

            const addedReply = await repliesRepositoryPostgres.addReply({
                content: addReplyPayload.content,
                owner: addReplyPayload.owner,
            });

            expect(addedReply).toStrictEqual(expectedAddedReply);
        });
    });

    describe('addReplyToComment method', () => {
        it('harus menambahkan balasan ke komentar dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123' });

            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

            await expect(repliesRepositoryPostgres.addReplyToComment('thread-123', 'comment-123', 'reply-123')).resolves.not.toThrowError();
        });
    });

    describe('verifyReplyOwner', () => {
        it('harus mengembalikan NotFoundError jika reply tidak ditemukan', async () => {
            const verifyPayload = {
                replyId: 'reply-123',
                userId: 'user-123',
            };

            await UsersTableTestHelper.addUser({ id: verifyPayload.userId });

            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

            await expect(repliesRepositoryPostgres.verifyReplyOwner(verifyPayload.replyId, verifyPayload.userId)).rejects.toThrow(NotFoundError);
        });

        it('harus mengembalikan AuthorizationError jika user tidak valid', async () => {
            const verifyPayload = {
                replyId: 'reply-123',
                userId: 'user-123',
            };

            await UsersTableTestHelper.addUser({ id: verifyPayload.userId });
            await CommentsTableTestHelper.addComment({ id: 'comment-12345' });
            await RepliesTableTestHelper.addReply({ id: verifyPayload.replyId, owner: verifyPayload.userId });

            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});

            await expect(repliesRepositoryPostgres.verifyReplyOwner(verifyPayload.replyId, 'user-12345')).rejects.toThrow(AuthorizationError);
        });
    });

    describe('getRepliesByThreadId method', () => {
        it('harus membuat object dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123' });
            await ThreadCommentsTableTestHelper.addCommentReplies({ replyId: 'reply-123' });

            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
            const resultGetRepliesByThreadId = await repliesRepositoryPostgres.getRepliesByThreadId('thread-123');

            expect(resultGetRepliesByThreadId).not.toBeNull();
            expect(resultGetRepliesByThreadId).toHaveLength(1);
        });
    });

    describe('deleteReplyById method', () => {
        it('harus menghapus reply dengan teknik soft delete', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123' });

            const repliesRepositoryPostgres = new RepliesRepositoryPostgres(pool, {});
            await repliesRepositoryPostgres.deleteReplyById('reply-123');

            const resultFindReplyById = await RepliesTableTestHelper.findReplyById('reply-123');

            expect(resultFindReplyById[0].is_delete).toBe(true);
        });
    });
});
