const CommentsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
    name: 'comments',
    register: (server, { injections }) => {
        const commentsHandler = new CommentsHandler(injections);
        server.route(routes(commentsHandler));
    },
};
