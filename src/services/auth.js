import createHttpError from 'http-errors';
import { UsersModel } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import { SessionsModel } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';

const createSession = () => ({
  accessToken: crypto.randomBytes(16).toString('base64'),
  refreshToken: crypto.randomBytes(16).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
});

const findUserByEmail = async (email) => {
  return await UsersModel.findOne({ email });
};

export const registerUser = async (payload) => {
  let user = await findUserByEmail(payload.email);
  if (user) {
    throw createHttpError(409, 'Already registered');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  user = await UsersModel.create({ ...payload, password: hashedPassword });

  return user;
};

export const loginUser = async (payload) => {
  const user = await findUserByEmail(payload.email);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const arePasswordsEqual = await bcrypt.compare(
    payload.password,
    user.password,
  );

  if (!arePasswordsEqual) {
    throw createHttpError(401, 'Incorrect email or password');
  }

  await SessionsModel.deleteOne({ userId: user._id });

  const session = await SessionsModel.create({
    userId: user._id,
    ...createSession(),
  });

  return session;
};

export const logoutUser = async (sessionId, sessionToken) => {
  await SessionsModel.deleteOne({ _id: sessionId, refreshToken: sessionToken });
};

export const refreshSession = async (sessionId, sessionToken) => {
  const session = await SessionsModel.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const now = new Date();

  if (session.refreshTokenValidUntil < now) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await SessionsModel.deleteOne({ _id: sessionId, refreshToken: sessionToken });

  const newSession = await SessionsModel.create({
    userId: session.userId,
    ...createSession(),
  });

  return newSession;
};
