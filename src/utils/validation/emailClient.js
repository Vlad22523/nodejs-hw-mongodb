import nodemailer from 'nodemailer';
import { MONGO_DB_VARS } from '../../constants/constants.js';
import { env } from '../env.js';

export const emailClient = nodemailer.createTransport({
  host: env(MONGO_DB_VARS.SMTP_HOST),
  port: env(MONGO_DB_VARS.SMTP_PORT),
  secure: false,
  auth: {
    user: env(MONGO_DB_VARS.SMTP_USERNAME),
    pass: env(MONGO_DB_VARS.SMTP_PASSWORD),
  },
});
