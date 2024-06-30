import { container } from 'tsyringe';
import RedisClient from 'ioredis'
import { config } from '../common/config';

// Symbol
export const RedisProvider = Symbol('REDIS_TOKEN');

// Type
export type RedisProvider = RedisClient;

// Register
container.register<RedisProvider>(RedisProvider, {
  useValue: new RedisClient(config.REDIS_URL)
});
