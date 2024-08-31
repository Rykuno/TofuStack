import { z } from 'zod';

export const registerEmailDto = z.object({
	email: z.string().email()
});

export type RegisterEmailDto = z.infer<typeof registerEmailDto>;
