class LikingCommentUseCase {
    constructor({ commentsRepository }) {
        this._commentsRepository = commentsRepository;
    }

    async execute({ threadId, commentId }, userCredentials) {
        await this._commentsRepository.findCommentByThreadId(threadId, commentId);

        const { id: userId } = userCredentials;

        const checkResult = await this._commentsRepository.checkAvailablityCommentWhatUserLike(commentId, userId);

        if (checkResult) {
            await this._commentsRepository.editLikedcountComment(commentId);
            await this._commentsRepository.deleteUserToComment(commentId);
            return;
        }

        await this._commentsRepository.editLikecountComment(commentId);
        await this._commentsRepository.addUserToComment(commentId, userId);
    }
}

module.exports = LikingCommentUseCase;
