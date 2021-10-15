exports.up = (pgm) => {
    pgm.addColumn('replies', {
        is_delete: {
            type: 'BOOLEAN',
        },
    });
};

exports.down = (pgm) => {
    pgm.dropColumn('replies', 'is_delete');
};
