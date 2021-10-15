const mapCommentToModel = ({
    id, username, created_at, replies, content, is_delete, like_count,
}) => ({
    id,
    username,
    date: created_at,
    replies,
    content,
    isDelete: is_delete,
    likeCount: like_count,
});

const mapReplyToModel = ({
    id, username, created_at, content, is_delete, comment_id,
}) => ({
    id,
    content,
    date: created_at,
    username,
    isDelete: is_delete,
    commentId: comment_id,
});

module.exports = { mapCommentToModel, mapReplyToModel };
