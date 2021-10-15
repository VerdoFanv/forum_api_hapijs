const { mapCommentToModel, mapReplyToModel } = require('../../Commons/mapDBToModel');

class GetThreadByIdUseCase {
    constructor({
        threadsRepository,
        commentsRepository,
        repliesRepository,
    }) {
        this._commentsRepository = commentsRepository;
        this._threadsRepository = threadsRepository;
        this._repliesRepository = repliesRepository;
    }

    async execute({ threadId }) {
        const resultGetThreadById = await this._threadsRepository.getThreadById(threadId);
        const resultGetCommentsByThreadId = await this._commentsRepository.getCommentsByThreadId(threadId);
        const resultGetRepliesByThreadId = await this._repliesRepository.getRepliesByThreadId(threadId);

        const resultCommentMapping = () => {
            let tempCommentId;

            return resultGetCommentsByThreadId.filter((comment) => {
                if (tempCommentId === comment.id) {
                    return;
                }

                tempCommentId = comment.id;
                return comment;
            }).map(mapCommentToModel);
        };

        const resultRepliesMapping = resultGetRepliesByThreadId.map(mapReplyToModel);

        const mappingRepliesByCommentId = (replies, commentId) => {
            return replies.filter((reply) => reply.commentId === commentId).map((replyAfterFilter) => {
                if (replyAfterFilter.isDelete) {
                    delete replyAfterFilter.isDelete;
                    delete replyAfterFilter.commentId;
                    return {
                        ...replyAfterFilter,
                        content: '**balasan telah dihapus**',
                    };
                }

                delete replyAfterFilter.isDelete;
                delete replyAfterFilter.commentId;
                return {
                    ...replyAfterFilter,
                };
            });
        };

        const resultGetCommentsQuery = () => {
            return resultCommentMapping().map((comment) => {
                if (comment.isDelete) {
                    delete comment.isDelete;
                    return {
                        ...comment,
                        content: '**komentar telah dihapus**',
                        replies: mappingRepliesByCommentId(resultRepliesMapping, comment.id),
                    };
                }

                delete comment.isDelete;
                return {
                    ...comment,
                    replies: mappingRepliesByCommentId(resultRepliesMapping, comment.id),
                };
            });
        };

        return {
            ...resultGetThreadById,
            comments: resultGetCommentsQuery(),
        };
    }
}

module.exports = GetThreadByIdUseCase;
