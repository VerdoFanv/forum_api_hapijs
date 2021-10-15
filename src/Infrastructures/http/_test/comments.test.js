const pool = require('../../database/postgres/pool');
const injections = require('../../injections');
const createServer = require('../createServer');
const TruncateAllTableTestHelper = require('../../../../tests/TruncateAllTableTestHelper');
const { doLoginOnly, doLoginUntilAddComment } = require('./testHelper/doLoginUntilAddComment');

describe('/threads/{threadId}/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await TruncateAllTableTestHelper.do();
    });

    describe('when POST /threads/{threadId}/comments', () => {
        it('harus mengembalikan error 401 jika user belum login', async () => {
            const server = await createServer(injections);

            const response = await server.inject({
                url: '/threads/thread-123/comments',
                method: 'POST',
                payload: { content: 'komentar saya' },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan error 404 threadId tidak ditemukan', async () => {
            const server = await createServer(injections);

            const { accessToken } = await doLoginOnly(server, { username: 'dicoding' });

            const response = await server.inject({
                url: '/threads/xxx/comments',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: { content: 'komentar saya' },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toBe(404);
            expect(responseJSON.status).toBe('fail');
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan error 400 jika payload tidak valid', async () => {
            const server = await createServer(injections);

            const { accessToken } = await doLoginOnly(server, { username: 'dicoding' });

            const response = await server.inject({
                url: '/threads/thread-123/comments',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: { title: 'komentar saya' },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toBe(400);
            expect(responseJSON.status).toBe('fail');
            expect(responseJSON.message).toBeDefined();
        });

        describe('harus menambahkan comment ke thread dan membuat objek dengan benar', () => {
            it('menggunakan userA', async () => {
                const server = await createServer(injections);
                const { addCommentResponse: response } = await doLoginUntilAddComment(server, {
                    username: 'userA',
                });

                const responseJSON = JSON.parse(response.payload);
                expect(response.statusCode).toBe(201);
                expect(responseJSON.status).toBe('success');
                expect(responseJSON.data).toBeDefined();
                expect(responseJSON.data.addedComment).toBeDefined();
            });

            it('menggunakan userB', async () => {
                const server = await createServer(injections);
                const { addCommentResponse: response } = await doLoginUntilAddComment(server, {
                    username: 'userB',
                });

                const responseJSON = JSON.parse(response.payload);
                expect(response.statusCode).toBe(201);
                expect(responseJSON.status).toBe('success');
                expect(responseJSON.data).toBeDefined();
                expect(responseJSON.data.addedComment).toBeDefined();
            });
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
        it('harus mengembalikan error 401 jika user belum login', async () => {
            const server = await createServer(injections);

            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123',
                method: 'DELETE',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan error 404 jika id tidak ditemukan', async () => {
            const server = await createServer(injections);

            const { accessToken, threadId } = await doLoginUntilAddComment(server, {
                username: 'dicoding',
            });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/xxx`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJSON.status).toEqual('fail');
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan error 403 jika user tidak sesuai', async () => {
            const server = await createServer(injections);

            const { threadId, commentId } = await doLoginUntilAddComment(server, {
                username: 'dicoding',
            });

            const { accessToken: accessTokenJohndoe } = await doLoginUntilAddComment(server, {
                username: 'johndoe',
            });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessTokenJohndoe}`,
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJSON.status).toEqual('fail');
            expect(responseJSON.message).toBeDefined();
        });

        it('harus menghapus komentar dengan benar', async () => {
            const server = await createServer(injections);

            const { threadId, commentId, accessToken } = await doLoginUntilAddComment(server, {
                username: 'dicoding',
            });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJSON.status).toEqual('success');
        });
    });

    describe('when PUT /threads/{threadId}/comments/{commentId}/likes', () => {
        it('harus mengembalikan 401 jika user belum login', async () => {
            const server = await createServer(injections);

            const response = await server.inject({
                url: '/threads/thread-123/comments/comment-123/likes',
                method: 'PUT',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan 404 jika thread dan comment id invalid', async () => {
            const server = await createServer(injections);

            const { accessToken, commentId } = await doLoginUntilAddComment(server, {
                username: 'dicoding',
            });

            const response = await server.inject({
                url: `/threads/xxx/comments/${commentId}/likes`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJSON.status).toEqual('fail');
            expect(responseJSON.message).toBeDefined();
        });

        it('harus menjalnkan aksi menyukai komentar dengan benar', async () => {
            const server = await createServer(injections);

            const { accessToken: accessTokenUserB, commentId, threadId } = await doLoginUntilAddComment(server, {
                username: 'userA',
            });
            const { accessToken: accessTokenUserA } = await doLoginUntilAddComment(server, {
                username: 'userB',
            });

            const responseLikingCommentUseUserB = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessTokenUserB}`,
                },
            });

            const responseLikingCommentUseUserA = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/likes`,
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessTokenUserA}`,
                },
            });

            expect(responseLikingCommentUseUserB.statusCode).toEqual(200);
            expect(JSON.parse(responseLikingCommentUseUserB.payload).status).toEqual('success');
            expect(responseLikingCommentUseUserA.statusCode).toEqual(200);
            expect(JSON.parse(responseLikingCommentUseUserA.payload).status).toEqual('success');
        });
    });
});
