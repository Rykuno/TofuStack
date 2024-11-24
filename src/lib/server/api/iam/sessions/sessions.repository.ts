import { injectable } from '@needle-di/core';
import { type CreateSessionDto, createSessionDto } from './dtos/create-session-dto';
import { RedisRepository } from '../../common/factories/redis-repository.factory';

@injectable()
export class SessionsRepository extends RedisRepository<'session'> {
	async get(id: string): Promise<CreateSessionDto | null> {
		const response = await this.redis.get({ prefix: this.prefix, key: id });
		if (!response) return null;
		return createSessionDto.parse(JSON.parse(response));
	}

	delete(id: string) {
		return this.redis.delete({ prefix: this.prefix, key: id });
	}

	create(createSessionDto: CreateSessionDto) {
		return this.redis.setWithExpiry({
			prefix: this.prefix,
			key: createSessionDto.id,
			value: JSON.stringify(createSessionDto),
			expiry: Math.floor(+createSessionDto.expiresAt / 1000)
		});
	}
}
