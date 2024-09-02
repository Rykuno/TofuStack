import { rateLimiter } from "hono-rate-limiter";
import { RedisStore } from 'rate-limit-redis'
import type { HonoTypes } from "../common/types/hono";
import { container } from "tsyringe";
import { RedisService } from '../services/redis.service';

// resolve dependencies from the container
const { client } = container.resolve(RedisService);

// Rate limiter middleware
export function limiter({ limit, minutes, key = "" }: {
  limit: number;
  minutes: number;
  key?: string;
}) {
  return rateLimiter({
    windowMs: minutes * 60 * 1000, // every x minutes
    limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) => {
      const vars = c.var as HonoTypes['Variables'];
      const clientKey = vars.user?.id || c.req.header("x-forwarded-for");
      const pathKey = key || c.req.routePath;
      return `${clientKey}_${pathKey}`
    }, // Method to generate custom identifiers for clients.
    // Redis store configuration
    store: new RedisStore({
      // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
      sendCommand: (...args: string[]) => client.call(...args),
    }) as any
  })
}


