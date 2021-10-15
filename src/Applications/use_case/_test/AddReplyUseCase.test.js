const AddReplyUseCase = require('../AddReplyUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AddCommentReplyUseCase', () => {
    it('harus mengembalikan InvariantError jika payload tidak sesuai', async () => {
        const payload = {
            body: 'balasan saya',
        };

        const addReplyUseCase = new AddReplyUseCase({});
        await expect(addReplyUseCase.execute(payload, {})).rejects.toThrow(InvariantError);
    });

    it('harus mengembalikan InvariantError jika tipe data tidak sesuai', async () => {
        const payload = {
            content: 123455,
        };

        const addReplyUseCase = new AddReplyUseCase({});
        await expect(addReplyUseCase.execute(payload, {})).rejects.toThrow(InvariantError);
    });

    it('harus bisa mengorkestrakan aksi AddCommentReply dengan benar', async () => {
        const endpointParams = {
            threadId: 'thread-123',
            commentId: 'comment-123',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const useCasePayload = {
            content: 'balasan komentar',
        };

        const addReplyPayload = {
            ...useCasePayload,
            owner: userCredentials.id,
        };

        const expectedAddedReply = {
            id: 'reply-123',
            content: useCasePayload.content,
            owner: userCredentials.id,
        };

        const mockThreadsRepository = new ThreadsRepository();
        const mockCommentsRepository = new CommentsRepository();
        const mockRepliesRepository = new RepliesRepository();

        mockThreadsRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
        mockCommentsRepository.verifyCommentAvaibility = jest.fn(() => Promise.resolve());
        mockRepliesRepository.addReply = jest.fn(() => Promise.resolve(expectedAddedReply));
        mockRepliesRepository.addReplyToComment = jest.fn(() => Promise.resolve());

        const addReplyUseCase = new AddReplyUseCase({
            commentsRepository: mockCommentsRepository,
            threadsRepository: mockThreadsRepository,
            repliesRepository: mockRepliesRepository,
        });

        const addedReply = await addReplyUseCase.execute(useCasePayload, endpointParams, userCredentials);

        expect(addedReply).toStrictEqual(expectedAddedReply);
        expect(mockThreadsRepository.verifyThreadAvaibility).toBeCalledWith(endpointParams.threadId);
        expect(mockCommentsRepository.verifyCommentAvaibility).toBeCalledWith(endpointParams.commentId);
        expect(mockRepliesRepository.addReply).toBeCalledWith(addReplyPayload);
        expect(mockRepliesRepository.addReplyToComment).toBeCalledWith(endpointParams.threadId, endpointParams.commentId, expectedAddedReply.id);
    });
});
