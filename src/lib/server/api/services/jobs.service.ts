import { injectable } from "tsyringe";
import { Queue, Worker, type Processor } from 'bullmq';
import RedisClient from "ioredis";
import { config } from "../common/config";

// BullMQ utilizes ioredis, which is no longer maintained but still works fine.
// I recommend using BullMQ with ioredis for now, but keep an eye out for future updates.

@injectable()
export class JobsService {
  constructor() { }

  createQueue(name: string) {
    return new Queue(name, {
      connection: new RedisClient(config.redis.url, {
        maxRetriesPerRequest: null
      })
    })
  }

  createWorker(name: string, prcoessor: Processor) {
    return new Worker(name, prcoessor, {
      connection: new RedisClient(config.redis.url, {
        maxRetriesPerRequest: null
      })
    })
  }
}
