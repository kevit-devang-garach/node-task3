import fs from 'fs';
import { env } from '../utils/validateEnv';

// readFileSync will read path from project's root ( process.cwd() )
const jwtPrivateKey = fs.readFileSync('./src/keys/jwtPrivate.key', 'utf8');
const jwtPublicKey = fs.readFileSync('./src/keys/jwtPublic.key', 'utf8');

const environment = {
  NODE_ENV: env.NODE_ENV,
  APP_PORT: env.APP_PORT,

  /* DATABASE */
  MONGODB_URL: env.MONGODB_URL,
  JWT_AUTH: env.JWT_AUTH_KEY,
  JWT_PRIVATE_KEY: jwtPrivateKey,
  JWT_PUBLIC_KEY: jwtPublicKey,
  /* DEBUG CONFIG */
  DEBUG_MODE: env.DEBUG_MODE,
};

export default environment;
