import { z } from 'zod';

export const envsDto = z.object({
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  SIGNING_SECRET: z.string(),
  ENV: z.enum(['dev', 'prod']),
  PORT: z.number({ coerce: true }),
  STORAGE_HOST: z.string(),
  STORAGE_PORT: z.number({ coerce: true }),
  STORAGE_ACCESS_KEY: z.string(),
  STORAGE_SECRET_KEY: z.string()
});

export type EnvsDto = z.infer<typeof envsDto>;
