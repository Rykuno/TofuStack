import { inject, injectable } from '@needle-di/core';
import { RedisService } from '../../databases/redis/redis.service';
import type { RedisRepository } from '../../common/interfaces/redis-repository.interface';

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
export class EmailChangeRequestsRepository implements RedisRepository<EmailChangeRequstModel> {
  private prefix = 'email-change-requests';

  constructor(private redis = inject(RedisService)) {}

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
