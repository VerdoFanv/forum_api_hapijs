exports.up = (pgm) => {
    pgm.sql("INSERT INTO users VALUES ('user', 'user', 'user', 'user')");
    pgm.sql("INSERT INTO replies VALUES ('reply', 'reply', 'user', 'reply', false)");
    pgm.sql("UPDATE threadcomments SET reply_id = 'reply' WHERE reply_id IS NULL");

    pgm.addConstraint('threadcomments', 'fk_threadcomments.reply_id_replies.id', 'FOREIGN KEY(reply_id) REFERENCES replies(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
    pgm.dropConstraint('threadcomments', 'fk_threadcomments.reply_id_replies.id');
    pgm.sql("UPDATE threadcomments SET reply_id = NULL WHERE reply_id = 'reply'");
    pgm.sql("DELETE FROM users WHERE id = 'user'");
    pgm.sql("DELETE FROM replies WHERE id = 'reply'");
};
