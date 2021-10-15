const routes = require('./routes');
const ReplyHandler = require('./handler');

module.exports = {
    name: 'replies',
    register: (server, { injections }) => {
        const replyHandler = new ReplyHandler(injections);
        server.route(routes(replyHandler));
    },
};
