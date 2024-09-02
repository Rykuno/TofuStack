import { injectable, type Disposable } from "tsyringe";
import { config } from "../common/config";
import { Redis } from "ioredis";

@injectable()
export class RedisService implements Disposable {
  readonly client: Redis;

  constructor() {
    this.client = new Redis(config.redis.url)
  }

  async dispose(): Promise<void> {
    this.client.disconnect();
  }
}