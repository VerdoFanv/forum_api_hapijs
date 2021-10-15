class CommentRepository {
    async addComment(comment) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async getCommentsByThreadId(threadId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async deleteComment(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async verifyCommentOwner(commentId, userId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async addCommentToThread(threadId, commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async verifyCommentAvaibility(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async checkAvailablityCommentWhatUserLike(commentId, userId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async findCommentByThreadId(threadId, commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async addUserToComment(commentId, userId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async deleteUserToComment(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async editLikecountComment(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async editLikedcountComment(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }
}

module.exports = CommentRepository;
