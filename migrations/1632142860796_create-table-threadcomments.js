exports.up = (pgm) => {
    pgm.createTable('threadcomments', {
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('threadcomments', 'fk_threadcomments.thread_threads.id', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('threadcomments', 'fk_threadcomments.comments_comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('threadcomments');
};
