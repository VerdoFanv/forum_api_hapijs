const LikingCommentUseCase = require('../LikingCommentUseCase');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');

describe('LikingCommentUseCase', () => {
    it('harus menjalankan aksi dengan benar', async () => {
        const endpointParams = {
            threadId: 'thread-123',
            commentId: 'comment-123',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const mockCommentsRepository = new CommentsRepository();
        mockCommentsRepository.findCommentByThreadId = jest.fn(() => Promise.resolve());
        mockCommentsRepository.checkAvailablityCommentWhatUserLike = jest.fn(() => Promise.resolve(false));

        mockCommentsRepository.addUserToComment = jest.fn(() => Promise.resolve());
        mockCommentsRepository.deleteUserToComment = jest.fn(() => Promise.resolve());
        mockCommentsRepository.editLikecountComment = jest.fn(() => Promise.resolve());
        mockCommentsRepository.editLikedcountComment = jest.fn(() => Promise.resolve());

        const likingComment = new LikingCommentUseCase({
            commentsRepository: mockCommentsRepository,
        });

        await likingComment.execute(endpointParams, userCredentials);
        expect(mockCommentsRepository.findCommentByThreadId).toBeCalledWith(endpointParams.threadId, endpointParams.commentId);
        expect(mockCommentsRepository.checkAvailablityCommentWhatUserLike).toBeCalledWith(endpointParams.commentId, userCredentials.id);
        expect(mockCommentsRepository.editLikecountComment).toBeCalledWith(endpointParams.commentId);
        expect(mockCommentsRepository.addUserToComment).toBeCalledWith(endpointParams.commentId, userCredentials.id);

        mockCommentsRepository.checkAvailablityCommentWhatUserLike = jest.fn(() => Promise.resolve(true));

        await likingComment.execute(endpointParams, userCredentials);
        expect(mockCommentsRepository.findCommentByThreadId).toBeCalledWith(endpointParams.threadId, endpointParams.commentId);
        expect(mockCommentsRepository.checkAvailablityCommentWhatUserLike).toBeCalledWith(endpointParams.commentId, userCredentials.id);
        expect(mockCommentsRepository.editLikedcountComment).toBeCalledWith(endpointParams.commentId);
        expect(mockCommentsRepository.deleteUserToComment).toBeCalledWith(endpointParams.commentId);
    });
});
