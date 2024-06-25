import { rateLimiter } from "hono-rate-limiter";
import { RedisStore } from 'rate-limit-redis'
import RedisClient from 'ioredis'
import type { HonoTypes } from "../types";

const client = new RedisClient()

type LimiterProps = {
  limit: number;
  minutes: number;
  key?: string;
}

export function limiter({limit, minutes, key = ""}: LimiterProps) {
  return rateLimiter({
    windowMs: minutes * 60 * 1000, // every x minutes
    limit, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: "draft-6", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    keyGenerator: (c) =>  {
      const vars = c.var as HonoTypes['Variables'];
      const clientKey = vars.user?.id || c.req.header("x-forwarded-for");
      const pathKey = key || c.req.routePath;
      return `${clientKey}_${pathKey}`
    }, // Method to generate custom identifiers for clients.
    // Redis store configuration
    store: new RedisStore({
      // @ts-expect-error - Known issue: the `call` function is not present in @types/ioredis
      sendCommand: (...args: string[]) => client.call(...args),
    }) as any,
  })
}


