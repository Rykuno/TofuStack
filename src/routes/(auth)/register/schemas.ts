import { z } from "zod";

export const registerFormSchema = z.object({
  email: z.string().email()
});

export const signInFormSchema = z.object({
  email: z.string().email(),
  token: z.string()
});


