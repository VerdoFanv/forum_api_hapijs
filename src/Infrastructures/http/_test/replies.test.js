const pool = require('../../database/postgres/pool');
const injections = require('../../injections');
const createServer = require('../createServer');
const TruncateAllTableTestHelper = require('../../../../tests/TruncateAllTableTestHelper');
const { doLoginOnly, doLoginUntilAddComment } = require('./testHelper/doLoginUntilAddComment');

describe('/threads/{threadId}/comments/{commentId}/replies endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await TruncateAllTableTestHelper.do();
    });

    describe('when POST /threads/{threadId}/comments/{commentId}/replies', () => {
        it('harus mengembalikan 401 jika user belum login', async () => {
            const server = await createServer(injections);

            const response = await server.inject({
                url: '/threads/xxx/comments/xxx/replies',
                method: 'POST',
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJSON.message).toEqual('Missing authentication');
        });

        it('harus mengembalikan 404 jika threadId tidak valid', async () => {
            const server = await createServer(injections);
            const { accessToken } = await doLoginOnly(server, { username: 'dicoding' });

            const response = await server.inject({
                url: '/threads/xxx/comments/comment-123/replies',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan 404 jika commentId tidak valid', async () => {
            const server = await createServer(injections);
            const { accessToken } = await doLoginOnly(server, { username: 'dicoding' });
            const response = await server.inject({
                url: '/threads/thread-123/comments/xxx/replies',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan 400 jika payload tidak valid', async () => {
            const server = await createServer(injections);
            const { accessToken, threadId, commentId } = await doLoginUntilAddComment(server, { username: 'userA' });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: 'sebuah balasan',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus menambahkan balasan ke komentar dengan userB', async () => {
            const server = await createServer(injections);
            const { threadId, commentId } = await doLoginUntilAddComment(server, { username: 'dicoding' });
            const { accessToken: accessTokenJohndoe } = await doLoginUntilAddComment(server, { username: 'johndoe' });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessTokenJohndoe}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJSON.data).toBeDefined();
            expect(responseJSON.data.addedReply).toBeDefined();
        });

        it('harus menambahkan balasan ke komentar dengan userA', async () => {
            const server = await createServer(injections);
            const { accessToken, threadId, commentId } = await doLoginUntilAddComment(server, { username: 'userA' });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJSON.data).toBeDefined();
            expect(responseJSON.data.addedReply).toBeDefined();
        });
    });

    describe('when DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId}', () => {
        it('harus mengembalikan 404 jika replyId tidak ditemukan', async () => {
            const server = await createServer(injections);
            const { accessToken, threadId, commentId } = await doLoginUntilAddComment(server, { username: 'userA' });

            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies/xxx`,
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

        it('harus menghapus balasan dengan baik', async () => {
            const server = await createServer(injections);
            const { accessToken, threadId, commentId } = await doLoginUntilAddComment(server, { username: 'userA' });

            const addReplyReponse = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const { data: { addedReply: { id: replyId } } } = JSON.parse(addReplyReponse.payload);
            const response = await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies/${replyId}`,
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
});
