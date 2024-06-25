import type { Promisify, RateLimitInfo } from 'hono-rate-limiter';
import type { Session, User } from 'lucia';

export type HonoTypes = {
	Variables: {
		session: Session | null;
		user: User | null;
		rateLimit: RateLimitInfo;
    rateLimitStore: {
      getKey?: (key: string) => Promisify<RateLimitInfo | undefined>;
      resetKey: (key: string) => Promisify<void>;
    };
	};
};
