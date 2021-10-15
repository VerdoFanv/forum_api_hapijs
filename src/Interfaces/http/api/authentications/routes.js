const routes = (handler) => ([
    {
        method: 'POST',
        path: '/authentications',
        handler: handler.postAuthenticationHandler,
        options: { tags: ['api'] },
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: handler.putAuthenticationHandler,
        options: { tags: ['api'] },
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: handler.deleteAuthenticationHandler,
        options: { tags: ['api'] },
    },
]);

module.exports = routes;
