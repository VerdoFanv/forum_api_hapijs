class CommentsHandler {
    constructor({ addCommentUseCase, deleteCommentUseCase, likingCommentUseCase }) {
        this._addCommentUseCase = addCommentUseCase;
        this._deleteCommentUseCase = deleteCommentUseCase;
        this._likingCommentUseCase = likingCommentUseCase;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
        this.putUserToCommentHandler = this.putUserToCommentHandler.bind(this);
    }

    async postCommentHandler({ payload, params, auth }, h) {
        const addedComment = await this._addCommentUseCase.execute(payload, params, auth.credentials);

        const response = h.response({
            status: 'success',
            data: { addedComment },
        });

        response.code(201);
        return response;
    }

    async deleteCommentHandler({ params, auth }, h) {
        await this._deleteCommentUseCase.execute(params, auth.credentials);

        const response = h.response({
            status: 'success',
        });

        return response;
    }

    async putUserToCommentHandler({ params, auth }, h) {
        await this._likingCommentUseCase.execute(params, auth.credentials);

        const response = h.response({
            status: 'success',
        });

        return response;
    }
}

module.exports = CommentsHandler;
