const pool = require('../../database/postgres/pool');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsThatUsersLikeTableTestHelper = require('../../../../tests/CommentsThatUsersLikeTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');
const TruncateAllTableTestHelper = require('../../../../tests/TruncateAllTableTestHelper');
const CommentsRepositoryPostgres = require('../CommentsRepositoryPostgres');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('CommentsRepositoryPostgres', () => {
    afterEach(async () => {
        await TruncateAllTableTestHelper.do();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment method', () => {
        it('harus menambahkan komentar dan membuat objek dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const fakeIdGenerator = () => '123';
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

            const addCommentPayload = {
                content: 'komentar saya',
                owner: 'user-123',
            };

            const expectedAddedComment = {
                id: 'comment-123',
                content: addCommentPayload.content,
                owner: addCommentPayload.owner,
            };

            const addedComment = await commentsRepositoryPostgres.addComment(addCommentPayload);
            expect(addedComment).toStrictEqual(expectedAddedComment);
        });
    });

    describe('deleteComment method', () => {
        it('harus berhasil melakukan soft delete terhadap comment', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            const fakeIdGenerator = () => '123';
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

            const { id } = await commentsRepositoryPostgres.addComment({
                content: 'komentar saya',
                owner: 'user-123',
            });

            await commentsRepositoryPostgres.deleteComment(id);
            expect(await CommentsTableTestHelper.findCommentById(id)).toHaveLength(1);
        });
    });

    describe('verifyCommentOwner method', () => {
        it('harus mengembalikan AuthorizationError jika userId tidak sama dengan pemilik comment', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-12345', username: 'Johndoe' });

            const fakeIdGenerator = () => '123';
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, fakeIdGenerator);

            await commentsRepositoryPostgres.addComment({
                content: 'komentar saya',
                owner: 'user-123',
            });

            await expect(commentsRepositoryPostgres.verifyCommentOwner('comment-123', 'user-12345')).rejects.toThrow(AuthorizationError);
        });
    });

    describe('verifyCommentAvaibility method', () => {
        it('harus mengembalikan NotFoundError jika komentar tidak ditemukan', async () => {
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
            await expect(commentsRepositoryPostgres.verifyCommentAvaibility('comment-123')).rejects.toThrow(NotFoundError);
        });

        it('harus menjalankan aksi dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});
            await expect(commentsRepositoryPostgres.verifyCommentAvaibility('comment-123')).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('getCommentsByThreadId method', () => {
        it('harus dapat membuat object dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', content: 'sebuah comment' });
            await CommentsTableTestHelper.addComment({ id: 'comment-12345', content: 'sebuah comment', isDelete: true });

            const commentPayload1 = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            };

            const commentPayload2 = {
                threadId: 'thread-123',
                commentId: 'comment-12345',
            };

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await commentsRepositoryPostgres.addCommentToThread(commentPayload1.threadId, commentPayload1.commentId);
            await commentsRepositoryPostgres.addCommentToThread(commentPayload2.threadId, commentPayload2.commentId);

            const resultGetThread = await commentsRepositoryPostgres.getCommentsByThreadId(commentPayload1.threadId);

            expect(resultGetThread).not.toBeNull();
            expect(resultGetThread).toHaveLength(2);
        });
    });

    describe('addCommentToThread method', () => {
        it('harus menambahkan threadId dan commentId ke database', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            };

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await expect(commentsRepositoryPostgres.addCommentToThread(payload.threadId, payload.commentId)).toEqual(Promise.resolve());
        });
    });

    describe('checkAvailablityCommentWhatUserLike method', () => {
        it('harus mengembalikan false, jika komentar tidak ditemukan', async () => {
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            expect(await commentsRepositoryPostgres.checkAvailablityCommentWhatUserLike('xxx', 'user-123')).toBe(false);
        });

        it('harus mengembalikan false, jika user tidak ditemukan', async () => {
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            expect(await commentsRepositoryPostgres.checkAvailablityCommentWhatUserLike('comment-123', 'xxx')).toBe(false);
        });

        it('harus mengembalikan true dengan benar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });
            await CommentsThatUsersLikeTableTestHelper.addUserToComment({ commentId: 'comment-123' });

            const payload = {
                commentId: 'comment-123',
                userId: 'user-123',
            };

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            expect(await commentsRepositoryPostgres.checkAvailablityCommentWhatUserLike(payload.commentId, payload.userId)).toBe(true);
        });
    });

    describe('findCommentByThreadId method', () => {
        it('harus mengembalikan NotFoundError jika threadId tidak ditemukan', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            };

            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: payload.threadId });
            await CommentsTableTestHelper.addComment({ id: payload.commentId });
            await ThreadCommentsTableTestHelper.addThreadComments({ threadId: payload.threadId, commentId: payload.commentId });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await expect(commentsRepositoryPostgres.findCommentByThreadId('thread-12345', payload.commentId)).rejects.toThrow(NotFoundError);
        });

        it('harus mengembalikan NotFoundError jika threadId tidak ditemukan', async () => {
            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await expect(commentsRepositoryPostgres.findCommentByThreadId('xxx', 'comment-12345')).rejects.toThrow(NotFoundError);
        });

        it('harus berhasil mencari thread dan comment id', async () => {
            const payload = {
                threadId: 'thread-123',
                commentId: 'comment-123',
            };

            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: payload.threadId });
            await CommentsTableTestHelper.addComment({ id: payload.commentId });
            await ThreadCommentsTableTestHelper.addThreadComments({ threadId: payload.threadId, commentId: payload.commentId });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await expect(commentsRepositoryPostgres.findCommentByThreadId(payload.threadId, payload.commentId)).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('addUserToComment method', () => {
        it('harus memasukkan comment dan user id dengan tepat', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            const payload = {
                commentId: 'comment-123',
                userId: 'user-123',
            };

            await commentsRepositoryPostgres.addUserToComment(payload.commentId, payload.userId);
            expect(await CommentsThatUsersLikeTableTestHelper.findUserToCommentByCommentId('comment-123')).toHaveLength(1);
        });
    });

    describe('deleteUserToComment method', () => {
        it('harus menghapus comment dan user id dengan tepat', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            const payload = {
                commentId: 'comment-123',
                userId: 'user-123',
            };

            await commentsRepositoryPostgres.deleteUserToComment(payload.commentId);
            expect(await CommentsThatUsersLikeTableTestHelper.findUserToCommentByCommentId('comment-123')).toHaveLength(0);
        });
    });

    describe('editLikecountComment method', () => {
        it('harus menambahkan jumlah suka pada komentar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await commentsRepositoryPostgres.editLikecountComment('comment-123');
            await commentsRepositoryPostgres.editLikecountComment('comment-123');

            const findResult = await CommentsTableTestHelper.findCommentById('comment-123');

            expect(findResult[0].like_count).toEqual(2);
        });
    });

    describe('editLikedcountComment method', () => {
        it('harus mengurangi jumlah suka pada komentar', async () => {
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123' });

            const commentsRepositoryPostgres = new CommentsRepositoryPostgres(pool, {});

            await commentsRepositoryPostgres.editLikecountComment('comment-123');
            await commentsRepositoryPostgres.editLikecountComment('comment-123');
            await commentsRepositoryPostgres.editLikedcountComment('comment-123');

            const findResult = await CommentsTableTestHelper.findCommentById('comment-123');

            expect(findResult[0].like_count).toEqual(1);
        });
    });
});
