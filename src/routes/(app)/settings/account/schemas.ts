import { z } from "zod";

export const verifyEmailFormSchema = z.object({
	token: z.string()
});

export const updateEmailFormSchema = z.object({
	email: z.string().email()
});