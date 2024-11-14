import { inject, injectable } from "@needle-di/core";
import { RedisService } from "../../databases/redis/redis.service";
import type { RedisRepository } from "../../common/interfaces/redis-repository.interface";

/* -------------------------------------------------------------------------- */
/*                                    Model                                   */
/* -------------------------------------------------------------------------- */
type LoginRequest = { email: string; hashedCode: string };

/* -------------------------------------------------------------------------- */
/*                                 Repository                                 */
/* -------------------------------------------------------------------------- */
@injectable()
export class LoginRequestsRepository implements RedisRepository<LoginRequest> {
  private prefix = "login-requests";
  constructor(private redis = inject(RedisService)) {}

  async set(args: LoginRequest) {
    return this.redis.setWithExpiry({
      prefix: this.prefix,
      key: args.email.toLowerCase(),
      value: args.hashedCode,
      expiry: 60 * 15,
    });
  }

  delete(email: string) {
    return this.redis.delete({ prefix: this.prefix, key: email.toLowerCase() });
  }

  async get(email: string): Promise<LoginRequest | null> {
    const hashedCode = await this.redis.get({
      prefix: this.prefix,
      key: email.toLowerCase(),
    });
    if (!hashedCode) return null;
    return { email, hashedCode: hashedCode };
  }
}
