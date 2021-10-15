const AddThreadUseCase = require('../AddThreadUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AddThread useCase', () => {
    it('harus mengembalikan error jika payload tidak sesuai', async () => {
        const payload = {
            title: 12345,
        };

        const addThreadUseCase = new AddThreadUseCase({});

        await expect(addThreadUseCase.execute(payload)).rejects.toThrow(InvariantError);
    });

    it('harus mengembalikan error jika tipe data tidak sesuai', async () => {
        const payload = {
            title: 12345,
            body: 'threads saya begini',
        };

        const addThreadUseCase = new AddThreadUseCase({});

        await expect(addThreadUseCase.execute(payload)).rejects.toThrow(InvariantError);
    });

    it('harus mengorkestrakan aksi AddThread dengan benar', async () => {
        const payload = {
            title: 'sebuah thread',
            body: 'thread saya begini',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const threadsRepositoryPayload = {
            ...payload,
            owner: userCredentials.id,
        };

        const expectedAddedThread = {
            id: 'thread-123',
            title: payload.title,
            owner: threadsRepositoryPayload.owner,
        };

        const mockThreadsRepository = new ThreadsRepository();
        mockThreadsRepository.addThread = jest.fn(() => Promise.resolve(expectedAddedThread));

        const addThreadUseCase = new AddThreadUseCase({
            threadRepository: mockThreadsRepository,
        });

        const addedThread = await addThreadUseCase.execute(payload, userCredentials);

        expect(addedThread).toEqual(expectedAddedThread);
        expect(mockThreadsRepository.addThread).toBeCalledWith(threadsRepositoryPayload);
    });
});
