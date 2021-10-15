const ThreadRepository = require('../../../Domains/threads/ThreadsRepository');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
    it('harus merupakan berinstansi dari ThreadRepository', () => {
        const threadRepositoryPostgres = new ThreadRepositoryPostgres({}, {});
        expect(threadRepositoryPostgres).toBeInstanceOf(ThreadRepository);
    });

    beforeEach(async () => {
        await UsersTableTestHelper.addUser({ id: 'user-123' });
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread method', () => {
        it('harus membuat object addedThread dengan benar', async () => {
            const fakeIdGenerator = () => '123';
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            const payload = {
                title: 'sebuah thread',
                body: 'thread saya begini',
                owner: 'user-123',
            };

            const expectedAddedThread = {
                id: 'thread-123',
                title: payload.title,
                owner: payload.owner,
            };

            expect(await threadRepositoryPostgres.addThread(payload)).toStrictEqual(expectedAddedThread);
        });
    });

    describe('verifyThreadAvaibility method', () => {
        it('harus mengembalikan NotFoundError jika id tidak ditemukan', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-rrt45')).rejects.toThrow(NotFoundError);
        });

        it('harus berhasil mencari thread', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            await expect(threadRepositoryPostgres.verifyThreadAvaibility('thread-123')).resolves.not.toThrow(NotFoundError);
        });
    });

    describe('getThreadById method', () => {
        it('harus mengembalikan NotFoundError jika id tidak ditemukan', async () => {
            const threadId = 'thread-123';

            const threadCommentsRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            await expect(threadCommentsRepositoryPostgres.getThreadById(threadId)).rejects.toThrow(NotFoundError);
        });

        it('harus membuat object dengan benar', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const threadCommentsRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            const result = await threadCommentsRepositoryPostgres.getThreadById('thread-123');

            expect(result.id).toBeDefined();
            expect(result.title).toBeDefined();
            expect(result.body).toBeDefined();
            expect(result.date).toBeDefined();
            expect(result.username).toBeDefined();
        });
    });
});
