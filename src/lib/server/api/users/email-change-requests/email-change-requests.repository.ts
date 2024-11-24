import { injectable } from '@needle-di/core';
import { RedisRepository } from '../../common/factories/redis-repository.factory';

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */
type EmailChangeRequstModel = {
	userId: string;
	requestedEmail: string;
	hashedCode: string;
};

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class EmailChangeRequestsRepository extends RedisRepository<'email-change-request'> {
	set(args: EmailChangeRequstModel) {
		return this.redis.setWithExpiry({
			prefix: this.prefix,
			key: args.userId,
			value: JSON.stringify(args),
			expiry: 60 * 15
		});
	}

	delete(userId: string) {
		return this.redis.delete({ prefix: this.prefix, key: userId });
	}

	async get(userId: string): Promise<EmailChangeRequstModel | null> {
		const value = await this.redis.get({
			prefix: this.prefix,
			key: userId
		});
		if (!value) return null;
		return { ...JSON.parse(value), userId };
	}
}
