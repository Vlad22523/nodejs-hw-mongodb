import { setupServer } from './server.js';
import { initMongoConnection } from './utils/initMongoDB.js';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};
bootstrap();
