import { OAuth2Client } from 'google-auth-library';
import { env } from './env.js';
import { MONGO_DB_VARS } from '../constants/constants.js';
import fs from 'node:fs';
import path from 'node:path';
import createHttpError from 'http-errors';

const googleConfigPath = path.join(process.cwd(), 'google.json');

const googleOauthParams = JSON.parse(
  fs.readFileSync(googleConfigPath).toString(),
);

const oauthClient = new OAuth2Client({
  project_id: googleOauthParams.web.project_id,
  clientId: env(MONGO_DB_VARS.GOOGLE_OAUTH_CLIENT_ID),
  clientSecret: env(MONGO_DB_VARS.GOOGLE_OAUTH_SECRET),
  redirectUri: env(MONGO_DB_VARS.GOOGLE_OAUTH_REDIRECT_URI),
});

export const generateOAuthLink = () => {
  return oauthClient.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });
};

export const verifyCode = async (code) => {
  try {
    const { tokens } = await oauthClient.getToken(code);
    const idToken = tokens.id_token;

    const ticket = await oauthClient.verifyIdToken(idToken);

    return ticket.payload;
  } catch (error) {
    if (error.status === 400) {
      throw createHttpError(error.status, 'Token is invalid');
    }
    throw createHttpError(500, 'Smth is wrong with Google Oauth!');
  }
};
