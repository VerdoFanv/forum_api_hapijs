const AddedUser = require('../AddedUser');

describe('a AddedUser entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        const payload = {
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
        };

        expect(() => new AddedUser(payload)).toThrowError('ADDED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        const payload = {
            id: 123,
            username: 'dicoding',
            fullname: {},
        };

        expect(() => new AddedUser(payload)).toThrowError('ADDED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create newUser object correctly', () => {
        const payload = {
            id: 'user-123',
            username: 'dicoding',
            fullname: 'Dicoding Indonesia',
        };

        const addedUser = new AddedUser(payload);

        expect(addedUser.id).toEqual(payload.id);
        expect(addedUser.username).toEqual(payload.username);
        expect(addedUser.fullname).toEqual(payload.fullname);
    });
});
