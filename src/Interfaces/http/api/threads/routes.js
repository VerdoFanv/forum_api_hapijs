const routes = (handler) => ([
    {
        path: '/threads',
        method: 'POST',
        handler: handler.postThreadHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
    {
        path: '/threads/{threadId}',
        method: 'GET',
        handler: handler.getThreadByIdHandler,
        options: { tags: ['api'] },
    },
]);

module.exports = routes;
