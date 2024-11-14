import { z } from "zod";

export const createLoginRequestDto = z.object({
  email: z.string().email(),
});

export type CreateLoginRequestDto = z.infer<typeof createLoginRequestDto>;
