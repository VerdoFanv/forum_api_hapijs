const InvariantError = require('../../Commons/exceptions/InvariantError');

class AddThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    async execute(useCasePayload, userCredentials) {
        this._verifyPayload(useCasePayload);

        const { title, body } = useCasePayload;
        const { id: owner } = userCredentials;

        return this._threadRepository.addThread({
            title, body, owner,
        });
    }

    _verifyPayload({ title, body }) {
        if (!title || !body) {
            throw new InvariantError('payload tidak sesuai dengan spesifikasi');
        }

        if (typeof title !== 'string' || typeof body !== 'string') {
            throw new InvariantError('tipe data harus string');
        }
    }
}

module.exports = AddThreadUseCase;
