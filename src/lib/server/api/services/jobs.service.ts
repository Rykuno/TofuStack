import { inject, injectable } from "tsyringe";
import { Queue, Worker, type Processor } from 'bullmq';
import { RedisProvider } from "../providers/redis.provider";


@injectable()
export class JobsService {
  constructor(@inject(RedisProvider) private readonly redis: RedisProvider, name: string) { }

  createQueue(name: string) {
    return new Queue(name, { connection: this.redis })
  }

  createWorker(name: string, prcoessor: Processor) {
    return new Worker(name, prcoessor, { connection: this.redis })
  }
}
