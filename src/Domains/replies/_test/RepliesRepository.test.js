const RepliesRepository = require('../RepliesRepository');

describe('RepliesRepository', () => {
    it('harus mengembalikan error jika method tidak di implementasikan', async () => {
        const repliesRepository = new RepliesRepository();

        await expect(() => repliesRepository.addReply({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => repliesRepository.deleteReplyById({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => repliesRepository.verifyReplyOwner({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => repliesRepository.addReplyToComment({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
        await expect(() => repliesRepository.getRepliesByThreadId({})).rejects.toThrowError('NEWCOMMENT_METHOD_IS_NOT_IMPLEMENTED');
    });
});
