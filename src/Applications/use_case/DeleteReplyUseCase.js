class DeleteReplyUseCase {
    constructor({
        threadsRepository,
        commentsRepository,
        repliesRepository,
    }) {
        this._threadsRepository = threadsRepository;
        this._commentsRepository = commentsRepository;
        this._repliesRepository = repliesRepository;
    }

    async execute({ threadId, commentId, replyId }, userCredentials) {
        const { id: owner } = userCredentials;

        await this._threadsRepository.verifyThreadAvaibility(threadId);
        await this._commentsRepository.verifyCommentAvaibility(commentId);

        await this._repliesRepository.verifyReplyOwner(replyId, owner);
        await this._repliesRepository.deleteReplyById(replyId);
    }
}

module.exports = DeleteReplyUseCase;
