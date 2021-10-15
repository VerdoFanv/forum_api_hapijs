const CommentsRepository = require('../CommentsRepository');

describe('NewCommentRepository', () => {
    it('harus mengembalikan error jika method tidak di implementasikan', async () => {
        const commentsRepository = new CommentsRepository();

        await expect(() => commentsRepository.addComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.deleteComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.verifyCommentOwner({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.getCommentsByThreadId({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.addCommentToThread({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.verifyCommentAvaibility({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.checkAvailablityCommentWhatUserLike({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.findCommentByThreadId({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.addUserToComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.deleteUserToComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.editLikecountComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => commentsRepository.editLikedcountComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    });
});
