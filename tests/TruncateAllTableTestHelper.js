/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const TruncateAllTableTestHelper = {
    async do() {
        const query = 'TRUNCATE users, authentications, threads, comments, threadcomments, commentsthatuserslike, replies CASCADE';
        await pool.query(query);
    },
};

module.exports = TruncateAllTableTestHelper;
