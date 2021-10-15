/* istanbul ignore file */

const doLoginOnly = async (server, {
    username = 'userA', fullname = 'userA', password = 'secret',
}) => {
    // add user
    await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
            username,
            password,
            fullname,
        },
    });

    // login
    const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
            username,
            password,
        },
    });
    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    return {
        accessToken,
    };
};

const doLoginUntilAddThread = async (server, {
    username = 'userA', fullname = 'userA', password = 'secret',
}) => {
    // add user
    await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
            username,
            password,
            fullname,
        },
    });

    // login
    const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
            username,
            password,
        },
    });
    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    // add thread
    const addThreadResponse = await server.inject({
        url: '/threads',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        payload: {
            title: 'threads saya',
            body: 'thread saya begini',
        },
    });
    const { data: { addedThread: { id: threadId } } } = JSON.parse(addThreadResponse.payload);

    return {
        accessToken,
        addThreadResponse,
        threadId,
    };
};

const doLoginUntilAddComment = async (server,
    {
        username = 'userA', fullname = 'userA', password = 'secret',
    }) => {
    // add user
    await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
            username,
            password,
            fullname,
        },
    });

    // login
    const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
            username,
            password,
        },
    });
    const { data: { accessToken } } = JSON.parse(loginResponse.payload);

    // add thread
    const addThreadResponse = await server.inject({
        url: '/threads',
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        payload: {
            title: 'threads saya',
            body: 'thread saya begini',
        },
    });
    const { data: { addedThread: { id: threadId } } } = JSON.parse(addThreadResponse.payload);

    const addCommentResponse = await server.inject({
        url: `/threads/${threadId}/comments`,
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        payload: { content: 'komentar saya' },
    });
    const { data: { addedComment: { id: commentId } } } = JSON.parse(addCommentResponse.payload);

    return {
        addThreadResponse,
        addCommentResponse,
        accessToken,
        threadId,
        commentId,
    };
};

module.exports = { doLoginOnly, doLoginUntilAddThread, doLoginUntilAddComment };
