const routes = (handler) => ([
    {
        path: '/threads/{threadId}/comments/{commentId}/replies',
        method: 'POST',
        handler: handler.postReplyHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
    {
        path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
        method: 'DELETE',
        handler: handler.deleteReplyHandler,
        options: {
            auth: 'verdoforum_jwt',
            tags: ['api'],
        },
    },
]);

module.exports = routes;
