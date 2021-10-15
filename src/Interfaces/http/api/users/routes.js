const routes = (handler) => ([
    {
        method: 'POST',
        path: '/users',
        handler: handler.postUserHandler,
        options: { tags: ['api'] },
    },
]);

module.exports = routes;
