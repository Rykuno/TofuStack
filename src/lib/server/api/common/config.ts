import * as envs from '$env/static/private';
import type { Config } from './types/config.type';

export const config: Config = {
  isProduction: envs.NODE_ENV === 'production',
  api: {
    origin: envs.ORIGIN,
  },
  storage: {
    accessKey: envs.STORAGE_ACCESS_KEY,
    secretKey: envs.STORAGE_SECRET_KEY,
    bucket: envs.STORAGE_BUCKET,
    url: envs.STORAGE_URL
  },
  postgres: {
    url: envs.DATABASE_URL
  },
  redis: {
    url: envs.REDIS_URL
  }
}

