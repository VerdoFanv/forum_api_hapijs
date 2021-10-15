const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const UserRepository = require('../../../Domains/users/UserRepository');
const NewUser = require('../../../Domains/users/entities/NewUser');
const AddedUser = require('../../../Domains/users/entities/AddedUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
    it('should be instance of UserRepository domain', () => {
        const userRepositoryPostgres = new UserRepositoryPostgres({}, {});

        expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
    });

    describe('behavior test', () => {
        afterEach(async () => {
            await UsersTableTestHelper.cleanTable();
        });

        afterAll(async () => {
            await pool.end();
        });

        describe('verifyAvailableUsername function', () => {
            it('should throw InvariantError when username not available', async () => {
                await UsersTableTestHelper.addUser({ username: 'dicoding' });
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

                await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).rejects.toThrowError(InvariantError);
            });

            it('should not throw InvariantError when username available', async () => {
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

                await expect(userRepositoryPostgres.verifyAvailableUsername('dicoding')).resolves.not.toThrowError(InvariantError);
            });
        });

        describe('addUser function', () => {
            it('should persist new user and return added user correctly', async () => {
                const newUser = new NewUser({
                    username: 'dicoding',
                    password: 'secret_password',
                    fullname: 'Dicoding Indonesia',
                });
                const fakeIdGenerator = () => '123';
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIdGenerator);

                const addedUser = await userRepositoryPostgres.addUser(newUser);

                const users = await UsersTableTestHelper.findUsersById('user-123');
                expect(addedUser).toStrictEqual(new AddedUser({
                    id: 'user-123',
                    username: 'dicoding',
                    fullname: 'Dicoding Indonesia',
                }));
                expect(users).toHaveLength(1);
            });
        });

        describe('getPasswordByUsername', () => {
            it('should throw InvariantError when user not found', () => {
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

                return expect(userRepositoryPostgres.getPasswordByUsername('dicoding'))
                    .rejects
                    .toThrowError(InvariantError);
            });

            it('should return username password when user is found', async () => {
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});
                await UsersTableTestHelper.addUser({
                    username: 'dicoding',
                    password: 'secret_password',
                });

                const password = await userRepositoryPostgres.getPasswordByUsername('dicoding');
                expect(password).toBe('secret_password');
            });
        });

        describe('getIdByUsername', () => {
            it('should throw InvariantError when user not found', async () => {
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

                await expect(userRepositoryPostgres.getIdByUsername('dicoding'))
                    .rejects
                    .toThrowError(InvariantError);
            });

            it('should return user id correctly', async () => {
                await UsersTableTestHelper.addUser({ id: 'user-321', username: 'dicoding' });
                const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

                const userId = await userRepositoryPostgres.getIdByUsername('dicoding');

                expect(userId).toEqual('user-321');
            });
        });
    });
});
