exports.up = (pgm) => {
    pgm.createTable('commentsthatuserslike', {
        comment_id: {
            type: 'VARCHAR(150)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(150)',
            notNull: true,
        },
    });

    pgm.addConstraint('commentsthatuserslike', 'fk_commentsthatuserslike.comment_id.comments.id', 'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE');
    pgm.addConstraint('commentsthatuserslike', 'fk_commentsthatuserslike.user_id.users.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropTable('commentsthatuserslike');
};
