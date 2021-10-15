exports.up = (pgm) => {
    pgm.addColumn('comments', {
        like_count: {
            type: 'INT',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('comments', 'like_count');
};
