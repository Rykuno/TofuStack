import { Redis } from 'ioredis';
import { inject, injectable } from '@needle-di/core';
import { ConfigService } from '../../common/configs/config.service';

@injectable()
export class RedisService {
	public redis: Redis;

	constructor(private configService = inject(ConfigService)) {
		this.redis = new Redis(this.configService.envs.REDIS_URL);
	}

	async get(data: { prefix: string; key: string }): Promise<string | null> {
		return this.redis.get(`${data.prefix}:${data.key}`);
	}

	async set(data: { prefix: string; key: string; value: string }): Promise<void> {
		await this.redis.set(`${data.prefix}:${data.key}`, data.value);
	}

	async delete(data: { prefix: string; key: string }): Promise<void> {
		await this.redis.del(`${data.prefix}:${data.key}`);
	}

	async setWithExpiry(data: {
		prefix: string;
		key: string;
		value: string;
		expiry: number;
	}): Promise<void> {
		await this.redis.set(`${data.prefix}:${data.key}`, data.value, 'EX', Math.floor(data.expiry));
	}
}
