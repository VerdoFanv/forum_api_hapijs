const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddReplyUseCase {
    constructor({
        threadsRepository,
        commentsRepository,
        repliesRepository,
    }) {
        this._threadsRepository = threadsRepository;
        this._commentsRepository = commentsRepository;
        this._repliesRepository = repliesRepository;
    }

    async execute(useCasePayload, { threadId, commentId }, userCredentials) {
        this._verifyPayload(useCasePayload);

        const { content } = useCasePayload;
        const { id: owner } = userCredentials;

        await this._threadsRepository.verifyThreadAvaibility(threadId);
        await this._commentsRepository.verifyCommentAvaibility(commentId);
        const addedReply = await this._repliesRepository.addReply({
            content, owner,
        });

        await this._repliesRepository.addReplyToComment(threadId, commentId, addedReply.id);

        return addedReply;
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

module.exports = AddReplyUseCase;
