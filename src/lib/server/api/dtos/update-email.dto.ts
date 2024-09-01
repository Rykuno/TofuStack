import { z } from 'zod';

export const updateEmailDto = z.object({
	email: z.string().email()
});
export type UpdateEmailDto = z.infer<typeof updateEmailDto>;
