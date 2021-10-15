class DeleteCommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    async execute({ commentId }, userCredentials) {
        const { id: owner } = userCredentials;

        await this._commentRepository.verifyCommentOwner(commentId, owner);
        await this._commentRepository.deleteComment(commentId);
    }
}

module.exports = DeleteCommentUseCase;
