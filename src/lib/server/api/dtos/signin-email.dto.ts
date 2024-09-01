import { z } from 'zod';

export const signInEmailDto = z.object({
	email: z.string().email(),
	token: z.string()
});

export type SignInEmailDto = z.infer<typeof signInEmailDto>;
