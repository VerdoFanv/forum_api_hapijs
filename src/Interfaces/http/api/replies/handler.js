class ReplyHandler {
    constructor({ addReplyUseCase, deleteReplyUseCase }) {
        this._addReplyUseCase = addReplyUseCase;
        this._deleteReplyUseCase = deleteReplyUseCase;

        this.postReplyHandler = this.postReplyHandler.bind(this);
        this.deleteReplyHandler = this.deleteReplyHandler.bind(this);
    }

    async postReplyHandler({ payload, params, auth }, h) {
        const addedReply = await this._addReplyUseCase.execute(payload, params, auth.credentials);

        const response = h.response({
            status: 'success',
            data: { addedReply },
        });

        response.code(201);
        return response;
    }

    async deleteReplyHandler({ params, auth }, h) {
        await this._deleteReplyUseCase.execute(params, auth.credentials);

        const response = h.response({
            status: 'success',
        });

        return response;
    }
}

module.exports = ReplyHandler;
