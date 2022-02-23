import 'dotenv/config.js';
import { bool, cleanEnv, port, str } from 'envalid';

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    devDefault: 'development',
    default: 'production',
    choices: ['development', 'production'],
    desc: 'Current Environment',
  }),
  APP_PORT: port(),
  MONGODB_URL: str({
    devDefault: 'mongodb://localhost:27017/ERP-POC',
    default: 'mongodb://localhost:27017/ERP-POC',
  }),
  DEBUG_MODE: bool({ default: false }),
  JWT_AUTH_KEY: str(),
});
