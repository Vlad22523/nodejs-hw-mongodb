import { MONGO_DB_VARS } from '../../constants/constants.js';
import { env } from '../env.js';
import { saveImageToCloudinary } from './saveImageToCloudinary.js';
import { saveImageToLocally } from './saveImageToLocally.js';

export const saveImage = async (file) => {
  if (env(MONGO_DB_VARS.IS_CLOUDINARY_ENABLED) === 'true') {
    return await saveImageToCloudinary(file);
  } else {
    return await saveImageToLocally(file);
  }
};
