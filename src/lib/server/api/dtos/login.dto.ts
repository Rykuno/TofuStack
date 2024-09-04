import { z } from 'zod';

export const loginDto = z.object({
	email: z.string().email()
});

export type LoginDto = z.infer<typeof loginDto>;
