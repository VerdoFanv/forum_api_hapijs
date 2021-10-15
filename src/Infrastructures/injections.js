/* istanbul ignore file */

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const BcryptEncryptionHelper = require('./security/BcryptEncryptionHelper');
const JwtTokenManager = require('./security/JwtTokenManager');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentsRepositoryPostgres = require('./repository/CommentsRepositoryPostgres');
const RepliesRepositoryPostgres = require('./repository/RepliesRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const AddThreadUseCase = require('../Applications/use_case/AddThreadUseCase');
const AddCommentUseCase = require('../Applications/use_case/AddCommentUseCase');
const GetThreadByIdUseCase = require('../Applications/use_case/GetThreadByIdUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/DeleteCommentUseCase');
const LikingCommentUseCase = require('../Applications/use_case/LikingCommentUseCase');
const AddReplyUseCase = require('../Applications/use_case/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/DeleteReplyUseCase');

const serviceInstanceContainer = {
    userRepository: new UserRepositoryPostgres(pool, nanoid),
    authenticationRepository: new AuthenticationRepositoryPostgres(pool),
    encryptionHelper: new BcryptEncryptionHelper(bcrypt),
    authenticationTokenManager: new JwtTokenManager(Jwt.token),
    threadRepository: new ThreadRepositoryPostgres(pool, nanoid),
    commentsRepository: new CommentsRepositoryPostgres(pool, nanoid),
    repliesRepository: new RepliesRepositoryPostgres(pool, nanoid),
};

const useCaseInstanceContainer = {
    addUserUseCase: new AddUserUseCase({
        userRepository: serviceInstanceContainer.userRepository,
        encryptionHelper: serviceInstanceContainer.encryptionHelper,
    }),
    loginUserUseCase: new LoginUserUseCase({
        authenticationRepository: serviceInstanceContainer.authenticationRepository,
        authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
        userRepository: serviceInstanceContainer.userRepository,
        encryptionHelper: serviceInstanceContainer.encryptionHelper,
    }),
    refreshAuthenticationUseCase: new RefreshAuthenticationUseCase({
        authenticationRepository: serviceInstanceContainer.authenticationRepository,
        authenticationTokenManager: serviceInstanceContainer.authenticationTokenManager,
    }),
    logoutUserUseCase: new LogoutUserUseCase({
        authenticationRepository: serviceInstanceContainer.authenticationRepository,
    }),
    addThreadUseCase: new AddThreadUseCase({
        threadRepository: serviceInstanceContainer.threadRepository,
    }),
    addCommentUseCase: new AddCommentUseCase({
        threadsRepository: serviceInstanceContainer.threadRepository,
        commentsRepository: serviceInstanceContainer.commentsRepository,
    }),
    getThreadByIdUseCase: new GetThreadByIdUseCase({
        threadsRepository: serviceInstanceContainer.threadRepository,
        commentsRepository: serviceInstanceContainer.commentsRepository,
        repliesRepository: serviceInstanceContainer.repliesRepository,
    }),
    deleteCommentUseCase: new DeleteCommentUseCase({
        commentRepository: serviceInstanceContainer.commentsRepository,
    }),
    likingCommentUseCase: new LikingCommentUseCase({
        commentsRepository: serviceInstanceContainer.commentsRepository,
    }),
    addReplyUseCase: new AddReplyUseCase({
        threadsRepository: serviceInstanceContainer.threadRepository,
        commentsRepository: serviceInstanceContainer.commentsRepository,
        repliesRepository: serviceInstanceContainer.repliesRepository,
    }),
    deleteReplyUseCase: new DeleteReplyUseCase({
        threadsRepository: serviceInstanceContainer.threadRepository,
        commentsRepository: serviceInstanceContainer.commentsRepository,
        repliesRepository: serviceInstanceContainer.repliesRepository,
    }),
};

// export all instance
module.exports = {
    ...serviceInstanceContainer,
    ...useCaseInstanceContainer,
};
