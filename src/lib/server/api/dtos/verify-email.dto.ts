import { z } from 'zod';

export const verifyEmailDto = z.object({
	token: z.string()
});

export type VerifyEmailDto = z.infer<typeof verifyEmailDto>;
