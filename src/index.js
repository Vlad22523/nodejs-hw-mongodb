import { UPLOAD_PATH } from './constants/path.js';
import { setupServer } from './server.js';
import { initMongoConnection } from './utils/initMongoDB.js';
import { createDirIfNotExist } from './utils/validation/createDirIfNotExist.js';

const bootstrap = async () => {
  await initMongoConnection();
  await createDirIfNotExist(UPLOAD_PATH);
  setupServer();
};
bootstrap();
