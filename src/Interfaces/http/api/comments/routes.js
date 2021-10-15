const routes = (handler) => ([
    {
        path: '/threads/{threadId}/comments',
        method: 'POST',
        handler: handler.postCommentHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
    {
        path: '/threads/{threadId}/comments/{commentId}',
        method: 'DELETE',
        handler: handler.deleteCommentHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
    {
        path: '/threads/{threadId}/comments/{commentId}/likes',
        method: 'PUT',
        handler: handler.putUserToCommentHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
]);

module.exports = routes;
