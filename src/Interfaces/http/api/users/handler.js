class UsersHandler {
    constructor({ addUserUseCase }) {
        this._addUserUseCase = addUserUseCase;

        this.postUserHandler = this.postUserHandler.bind(this);
    }

    async postUserHandler({ payload }, h) {
        const addedUser = await this._addUserUseCase.execute(payload);

        const response = h.response({
            status: 'success',
            data: {
                addedUser,
            },
        });

        response.code(201);
        return response;
    }
}

module.exports = UsersHandler;
