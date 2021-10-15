const pool = require('../../database/postgres/pool');
const injections = require('../../injections');
const createServer = require('../createServer');
const TruncateAllTableTestHelper = require('../../../../tests/TruncateAllTableTestHelper');
const { doLoginOnly, doLoginUntilAddThread, doLoginUntilAddComment } = require('./testHelper/doLoginUntilAddComment');

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await TruncateAllTableTestHelper.do();
    });

    describe('when POST /threads', () => {
        it('harus mengembalikan error 401 jika user belum login', async () => {
            const server = await createServer(injections);

            const response = await server.inject({
                url: '/threads',
                method: 'POST',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(401);
            expect(responseJSON.message).toBeDefined();
        });

        it('harus mengembalikan error 400 jika payload tidak valid', async () => {
            const server = await createServer(injections);

            const { accessToken } = await doLoginOnly(server, { username: 'dicoding' });

            // add thread
            const response = await server.inject({
                url: '/threads',
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                payload: { title: 'threads saya' },
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toBe(400);
            expect(responseJSON.status).toBe('fail');
            expect(responseJSON.message).toBeDefined();
        });

        it('harus menambahkan thread dengan benar', async () => {
            const server = await createServer(injections);
            const { addThreadResponse: response } = await doLoginUntilAddThread(server, { username: 'dicoding' });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toBe(201);
            expect(responseJSON.status).toBe('success');
            expect(responseJSON.data).toBeDefined();
            expect(responseJSON.data.addedThread).toBeDefined();
        });
    });

    describe('when GET /threads/{threadId}', () => {
        beforeEach(() => jest.setTimeout(15000));

        it('harus mengembaikan object detail thread dan komentar dengan benar', async () => {
            jest.setTimeout(10000);
            const server = await createServer(injections);
            // add user
            const { threadId } = await doLoginUntilAddComment(server, { username: 'dicoding' });

            // get detail thread
            const response = await server.inject({
                url: `/threads/${threadId}`,
                method: 'GET',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toBe(200);
            expect(responseJSON.status).toBe('success');
            expect(responseJSON.data).toBeDefined();
            expect(responseJSON.data.thread).toBeDefined();
            expect(responseJSON.data.thread.comments).not.toHaveLength(0);
        });

        it('harus mengembaikan object detail thread, komentar dan balasan dengan benar', async () => {
            const server = await createServer(injections);
            const { threadId, commentId, accessToken: accessTokenDicoding } = await doLoginUntilAddComment(server, { username: 'dicoding' });
            const { accessToken: accessTokenJohndoe } = await doLoginUntilAddComment(server, { username: 'johndoe' });

            await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessTokenJohndoe}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            await server.inject({
                url: `/threads/${threadId}/comments/${commentId}/replies`,
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessTokenDicoding}`,
                },
                payload: {
                    content: 'sebuah balasan',
                },
            });

            const response = await server.inject({
                url: `/threads/${threadId}`,
                method: 'GET',
            });

            const responseJSON = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJSON.data).toBeDefined();
            expect(responseJSON.data.thread).toBeDefined();
            expect(responseJSON.data.thread.comments).toBeDefined();
            expect(responseJSON.data.thread.comments).toHaveLength(1);

            const [comment1] = responseJSON.data.thread.comments;
            expect(comment1.replies).toBeDefined();
            expect(comment1.replies).toHaveLength(2);
        });
    });
});
