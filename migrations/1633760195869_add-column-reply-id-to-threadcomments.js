exports.up = (pgm) => {
    pgm.addColumn('threadcomments', {
        reply_id: {
            type: 'VARCHAR(50)',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('threadcomments', 'reply_id');
};
