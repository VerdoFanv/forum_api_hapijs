const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddCommentUseCase {
    constructor({ commentsRepository, threadsRepository }) {
        this._commentsRepository = commentsRepository;
        this._threadsRepository = threadsRepository;
    }

    async execute(useCasePayload, { threadId }, userCredentials) {
        this._verifyPayload(useCasePayload);

        const { content } = useCasePayload;
        const { id: owner } = userCredentials;

        await this._threadsRepository.verifyThreadAvaibility(threadId);
        const addedComment = await this._commentsRepository.addComment({
            content, owner,
        });

        await this._commentsRepository.addCommentToThread(threadId, addedComment.id);

        return addedComment;
    }

    _verifyPayload({ content }) {
        if (!content) {
            throw new InvariantError('spesifikasi tidak sesuai');
        }

        if (typeof content !== 'string') {
            throw new InvariantError('tipe data harus string');
        }
    }
}

module.exports = AddCommentUseCase;
