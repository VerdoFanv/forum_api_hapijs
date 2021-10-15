const DeleteReplyUseCase = require('../DeleteReplyUseCase');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');

describe('DeleteReplyUseCase', () => {
    it('harus dapat mengorkestrakan aksi DeleteReply dengan benar', async () => {
        const endpointParams = {
            threadId: 'thread-123',
            commentId: 'comment-123',
            replyId: 'reply-123',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const repliesRepositoryPayload = {
            replyId: endpointParams.replyId,
            owner: userCredentials.id,
        };

        const mockThreadsRepository = new ThreadsRepository();
        const mockCommentsRepository = new CommentsRepository();
        const mockRepliesRepository = new RepliesRepository();

        mockThreadsRepository.verifyThreadAvaibility = jest.fn(() => Promise.resolve());
        mockCommentsRepository.verifyCommentAvaibility = jest.fn(() => Promise.resolve());
        mockRepliesRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
        mockRepliesRepository.deleteReplyById = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteReplyUseCase({
            commentsRepository: mockCommentsRepository,
            threadsRepository: mockThreadsRepository,
            repliesRepository: mockRepliesRepository,
        });

        await deleteCommentUseCase.execute(endpointParams, userCredentials);

        expect(mockThreadsRepository.verifyThreadAvaibility).toBeCalledWith(endpointParams.threadId);
        expect(mockCommentsRepository.verifyCommentAvaibility).toBeCalledWith(endpointParams.commentId);
        expect(mockRepliesRepository.verifyReplyOwner).toBeCalledWith(repliesRepositoryPayload.replyId, repliesRepositoryPayload.owner);
        expect(mockRepliesRepository.deleteReplyById).toBeCalledWith(endpointParams.replyId);
    });
});
