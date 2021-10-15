const AddCommentUseCase = require('../AddCommentUseCase');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');

describe('AddCommentUseCase', () => {
    it('harus mengembalikan error jika tidak sesuai dengan spesifikasi', async () => {
        const payload = {
            title: 'Ini komentar',
        };

        const addCommentUseCase = new AddCommentUseCase({}, {}, {});

        await expect(addCommentUseCase.execute(payload, {})).rejects.toThrow(InvariantError);
    });

    it('harus mengembalikan error jika tipe data tidak sesuai', async () => {
        const payload = {
            content: 12345,
        };

        const addCommentUseCase = new AddCommentUseCase({}, {}, {});

        await expect(addCommentUseCase.execute(payload, {})).rejects.toThrow(InvariantError);
    });

    it('harus bisa mengorkestrakan aksi Addcomment dengan benar', async () => {
        const endpointParams = {
            threadId: 'thread-123',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const useCasePayload = {
            content: 'thread ini caranya begini',
        };

        const addCommentPayload = {
            ...useCasePayload,
            owner: userCredentials.id,
        };

        const expectedAddedComment = {
            id: 'comment-123',
            content: useCasePayload.content,
            owner: userCredentials.id,
        };

        const mockThreadsRepository = new ThreadsRepository();
        const mockCommentsRepository = new CommentsRepository();

        mockThreadsRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
        mockCommentsRepository.addComment = jest.fn(() => Promise.resolve(expectedAddedComment));
        mockCommentsRepository.addCommentToThread = jest.fn(() => Promise.resolve());

        const addCommentUseCase = new AddCommentUseCase({
            commentsRepository: mockCommentsRepository,
            threadsRepository: mockThreadsRepository,
        });

        const addedComment = await addCommentUseCase.execute(useCasePayload, endpointParams, userCredentials);

        expect(addedComment).toStrictEqual(expectedAddedComment);
        expect(mockThreadsRepository.verifyThreadAvaibility).toBeCalledWith(endpointParams.threadId);
        expect(mockCommentsRepository.addComment).toBeCalledWith(addCommentPayload);
        expect(mockCommentsRepository.addCommentToThread).toBeCalledWith(endpointParams.threadId, expectedAddedComment.id);
    });
});
