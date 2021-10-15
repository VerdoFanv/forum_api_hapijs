class ThreadsHandler {
    constructor({ addThreadUseCase, getThreadByIdUseCase }) {
        this._addThreadUseCase = addThreadUseCase;
        this._getThreadByIdUseCase = getThreadByIdUseCase;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadByIdHandler = this.getThreadByIdHandler.bind(this);
    }

    async postThreadHandler({ payload, auth }, h) {
        const addedThread = await this._addThreadUseCase.execute(payload, auth.credentials);

        const response = h.response({
            status: 'success',
            data: { addedThread },
        });

        response.code(201);
        return response;
    }

    async getThreadByIdHandler({ params }, h) {
        const thread = await this._getThreadByIdUseCase.execute(params);

        const response = h.response({
            status: 'success',
            data: { thread },
        });

        return response;
    }
}

module.exports = ThreadsHandler;
