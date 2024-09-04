import { z } from 'zod';

export const verifyLoginDto = z.object({
	email: z.string().email(),
	token: z.string()
});

export type VerifyLoginDto = z.infer<typeof verifyLoginDto>;
