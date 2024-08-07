import { container } from 'tsyringe';
import { env } from '../configs/envs.config';
import RedisClient from 'ioredis'

export const RedisProvider = Symbol('REDIS_TOKEN');
export type RedisProvider = RedisClient;
container.register<RedisProvider>(RedisProvider, {
  useValue: new RedisClient(env.REDIS_URL, {
    maxRetriesPerRequest: null
  })
});
