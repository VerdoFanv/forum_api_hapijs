class RepliesRepository {
    async addReply({ content, owner }) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async deleteReplyById(replyId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(replyId, userId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async addReplyToComment(commentId, replyId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }

    async getRepliesByThreadId(commentId) {
        throw new Error('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    }
}

module.exports = RepliesRepository;
