import { z } from 'zod';

export const updateEmailDto = z.object({
	email: z.string()
});
export type UpdateEmailDto = z.infer<typeof updateEmailDto>;
