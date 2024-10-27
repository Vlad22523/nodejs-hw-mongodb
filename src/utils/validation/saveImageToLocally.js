import fs from 'fs/promises';
import path from 'node:path';
import { UPLOAD_PATH } from '../../constants/path.js';
import { env } from '../env.js';
import { MONGO_DB_VARS } from '../../constants/constants.js';

export const saveImageToLocally = async (file) => {
  const { path: oldPath, filename } = file;
  const newPath = path.join(UPLOAD_PATH, filename);

  await fs.rename(oldPath, newPath);

  return `${env(MONGO_DB_VARS.BACKEND_DOMAIN)}/files/${filename}`;
};
