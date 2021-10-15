const ThreadsRepository = require('../ThreadsRepository');

describe('ThreadsRepository', () => {
    it('harus menghasilkan error jika absktrak method tidak di implementasikan', async () => {
        const threadsRepository = new ThreadsRepository();

        await expect(() => threadsRepository.addThread({})).rejects.toThrowError('THREADSREPOSITORY_METHOD_NOT_IMPLEMENTED');
        await expect(() => threadsRepository.getThreadById({})).rejects.toThrowError('THREADSREPOSITORY_METHOD_NOT_IMPLEMENTED');
        await expect(() => threadsRepository.verifyThreadAvaibility({})).rejects.toThrowError('THREADSREPOSITORY_METHOD_NOT_IMPLEMENTED');
    });
});
