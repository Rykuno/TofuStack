import { z } from 'zod';

export const verifyEmailDto = z.object({
  code: z.string().length(6)
});

export type VerifyEmailDto = z.infer<typeof verifyEmailDto>;
