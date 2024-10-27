import createHttpError from 'http-errors';
import { UsersModel } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import crypto, { randomBytes } from 'node:crypto';
import { SessionsModel } from '../db/models/session.js';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/time.js';
import { emailClient } from '../utils/validation/emailClient.js';
import { MONGO_DB_VARS } from '../constants/constants.js';
import { env } from '../utils/env.js';
import { generateResetPasswordEmail } from '../utils/validation/generateResetPasswordEmail.js';
import jwt from 'jsonwebtoken';
import { generateOAuthLink, verifyCode } from '../utils/googleOAuth.js';

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

export const sendResetPasswordToken = async (email) => {
  const user = await UsersModel.findOne({ email });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(MONGO_DB_VARS.JWT_SECRET),
    { expiresIn: 60 * 15 },
  );

  const resetLink = `${env(
    MONGO_DB_VARS.FRONTEND_DOMAIN,
  )}/reset-password?token=${resetToken}`;

  try {
    await emailClient.sendMail({
      to: email,
      from: env(MONGO_DB_VARS.SMTP_FROM),
      html: generateResetPasswordEmail({
        name: user.name,
        resetLink: resetLink,
      }),
      subject: 'Reset your password!',
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Error in sending email');
  }
};

export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, env(MONGO_DB_VARS.JWT_SECRET));
  } catch (error) {
    throw createHttpError(401, error.message);
  }

  const user = await UsersModel.findOne({
    email: payload.email,
    _id: payload.sub,
  });

  // const user = await UsersModel.findOne(payload.sub);

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // await UsersModel.findByIdAndUpdate(user._id, { password: hashedPassword });
  try {
    await UsersModel.updateOne({ _id: user._id }, { password: hashedPassword });
    await SessionsModel.deleteMany({ userId: user._id });
  } catch (error) {
    console.log(error);
    throw createHttpError(401, 'Token is expired or invalid.');
  }
};

export const getGoogleOauthLink = () => {
  return generateOAuthLink();
};

export const verifyGoogleOauth = async (code) => {
  const { name, email, picture } = await verifyCode(code);

  let user = await UsersModel.findOne({ email });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(40), 10);
    user = await UsersModel.create({
      name,
      email,
      photo: picture,
      password,
    });
  }

  await SessionsModel.deleteOne({
    userId: user._id,
  });

  return await SessionsModel.create({
    userId: user._id,
    ...createSession(),
  });
};
