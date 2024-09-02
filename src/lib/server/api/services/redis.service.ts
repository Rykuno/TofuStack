import { createClient, type RedisClientType } from "redis";
import { injectable, type Disposable } from "tsyringe";
import { config } from "../common/config";
import type { AsyncService } from "../common/inferfaces/async-service.interface";

@injectable()
export class RedisService implements Disposable, AsyncService {
  readonly client: RedisClientType;
  private isConnected: boolean = false;

  constructor() {
    this.client = createClient({
      url: config.redis.url,
    });
    this.init();
  }

  async ensureConnected(): Promise<void> {
    if (!this.isConnected) {
      await this.init();
    }
  }

  async init(): Promise<void> {
    try {
      await this.client.connect();
      this.isConnected = this.client.isReady;
      console.log('Redis connected');
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
      console.log('Redis disconnected');
    }
  }
}