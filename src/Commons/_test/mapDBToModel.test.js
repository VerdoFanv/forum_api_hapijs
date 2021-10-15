const { mapCommentToModel, mapReplyToModel } = require('../mapDBToModel');

describe('mapCommentToModel function', () => {
    it('harus mengembalikan nilai sesuai spesifikasi', () => {
        const resultQuery = [
            {
                id: 'comment-123',
                username: 'userA',
                created_at: new Date().toISOString(),
                replies: [],
                content: 'Komentar saya',
                is_delete: false,
                like_count: 0,
            },
        ];

        const expectedMapping = {
            id: resultQuery[0].id,
            username: resultQuery[0].username,
            date: resultQuery[0].created_at,
            replies: resultQuery[0].replies,
            content: resultQuery[0].content,
            isDelete: resultQuery[0].is_delete,
            likeCount: resultQuery[0].like_count,
        };

        expect(resultQuery.map(mapCommentToModel)[0]).toEqual(expectedMapping);
    });
});

describe('mapReplyToModel function', () => {
    it('harus mengembalikan nilai sesuai spesifikasi', () => {
        const resultQuery = [
            {
                id: 'reply-123',
                username: 'userA',
                created_at: new Date().toISOString(),
                content: 'Balasan saya',
            },
        ];

        const expectedMapping = {
            id: resultQuery[0].id,
            username: resultQuery[0].username,
            date: resultQuery[0].created_at,
            content: resultQuery[0].content,
        };

        expect(resultQuery.map(mapReplyToModel)[0]).toEqual(expectedMapping);
    });
});
