const CommentRepository = require('../../../Domains/comments/CommentsRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
    it('harus dapat mengorkestrakan aksi DeleteCommentUseCase dengan benar', async () => {
        const endpointParams = {
            commentId: 'comment-123',
        };

        const userCredentials = {
            id: 'user-123',
        };

        const commentRepositoryPayload = {
            commentId: endpointParams.commentId,
            owner: userCredentials.id,
        };

        const mockCommentRepository = new CommentRepository();
        mockCommentRepository.verifyCommentOwner = jest.fn(() => Promise.resolve());
        mockCommentRepository.deleteComment = jest.fn(() => Promise.resolve());

        const deleteCommentUseCase = new DeleteCommentUseCase({
            commentRepository: mockCommentRepository,
        });

        await deleteCommentUseCase.execute(endpointParams, userCredentials);

        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith(commentRepositoryPayload.commentId, commentRepositoryPayload.owner);
        expect(mockCommentRepository.deleteComment).toBeCalledWith(endpointParams.commentId);
    });
});
