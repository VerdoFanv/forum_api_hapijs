const GetThreadByIdUseCase = require('../GetThreadByIdUseCase');
const CommentsRepository = require('../../../Domains/comments/CommentsRepository');
const ThreadsRepository = require('../../../Domains/threads/ThreadsRepository');
const RepliesRepository = require('../../../Domains/replies/RepliesRepository');

describe('GetThreadByIdUseCase', () => {
    it('harus dapat mengorkestrakan GetThreadByIdUseCase dengan benar', async () => {
        const endpointParams = {
            threadId: 'thread-123',
        };

        const fakeGethreadById = {
            id: 'thread-123',
            title: 'sebuah thread',
            body: 'sebuah body thread',
            date: new Date().toISOString(),
            username: 'dicoding',
        };

        const fakeGetReplies = [
            {
                id: 'reply-123',
                username: 'userA',
                created_at: new Date().toISOString(),
                content: 'sebuah balasan',
                is_delete: false,
                comment_id: 'comment-123',
            },
            {
                id: 'reply-12345',
                username: 'userB',
                created_at: new Date().toISOString(),
                content: 'sebuah balasan',
                is_delete: true,
                comment_id: 'comment-12345',
            },
        ];

        const fakeGetComments = [
            {
                id: 'comment-123',
                username: 'dicoding',
                created_at: new Date().toISOString(),
                replies: [
                    {
                        id: fakeGetReplies[0].id,
                        username: fakeGetReplies[0].username,
                        date: fakeGetReplies[0].created_at,
                        content: fakeGetReplies[0].content,
                    },
                ],
                content: 'sebuah comment',
                is_delete: false,
                like_count: 1,
            },
            {
                id: 'comment-12345',
                username: 'xpaww',
                created_at: new Date().toISOString(),
                replies: [
                    {
                        id: fakeGetReplies[1].id,
                        username: fakeGetReplies[1].username,
                        date: fakeGetReplies[1].created_at,
                        content: '**balasan telah dihapus**',
                    },
                ],
                content: 'sebuah comment',
                is_delete: true,
                like_count: 0,
            },
        ];

        const expectedMappingComments = [
            {
                id: fakeGetComments[0].id,
                username: fakeGetComments[0].username,
                date: fakeGetComments[0].created_at,
                replies: fakeGetComments[0].replies,
                content: fakeGetComments[0].content,
                likeCount: fakeGetComments[0].like_count,
            },
            {
                id: fakeGetComments[1].id,
                username: fakeGetComments[1].username,
                date: fakeGetComments[1].created_at,
                replies: fakeGetComments[1].replies,
                content: '**komentar telah dihapus**',
                likeCount: fakeGetComments[1].like_count,
            },
        ];

        const expectedGethreadById = {
            ...fakeGethreadById,
            comments: expectedMappingComments,
        };

        const mockThreadsRepository = new ThreadsRepository();
        const mockCommentsRepository = new CommentsRepository();
        const mockRepliesRepository = new RepliesRepository();

        mockThreadsRepository.getThreadById = jest.fn(() => Promise.resolve(fakeGethreadById));
        mockCommentsRepository.getCommentsByThreadId = jest.fn(() => Promise.resolve(fakeGetComments));
        mockRepliesRepository.getRepliesByThreadId = jest.fn(() => Promise.resolve(fakeGetReplies));

        const getThreadByIdUseCase = new GetThreadByIdUseCase({
            commentsRepository: mockCommentsRepository,
            threadsRepository: mockThreadsRepository,
            repliesRepository: mockRepliesRepository,
        });

        const result = await getThreadByIdUseCase.execute(endpointParams);

        expect(result).toStrictEqual(expectedGethreadById);
        expect(mockThreadsRepository.getThreadById).toBeCalledWith(endpointParams.threadId);
        expect(mockCommentsRepository.getCommentsByThreadId).toBeCalledWith(endpointParams.threadId);
        expect(mockRepliesRepository.getRepliesByThreadId).toBeCalledWith(endpointParams.threadId);
    });
});
