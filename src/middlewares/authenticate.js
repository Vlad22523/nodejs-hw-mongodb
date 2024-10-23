import createHttpError from 'http-errors';
import { SessionsModel } from '../db/models/session.js';
import { UsersModel } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('authorization');

  if (!authHeader) {
    return next(createHttpError(401, 'Auth header is required'));
  }

  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Auth header must be of type Bearer'));
  }

  const session = await SessionsModel.findOne({ accessToken: token });

  if (!session) {
    return next(
      createHttpError(401, 'Auth token is not associated with any sessions!'),
    );
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Auth token is expired'));
  }

  const user = await UsersModel.findById(session.userId);

  if (!user) {
    return next(
      createHttpError(401, 'No user with associated with this session'),
    );
  }

  req.user = user;

  next();
};
