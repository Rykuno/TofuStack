import { z } from "zod";

export const verifyLoginRequestDto = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export type VerifyLoginRequestDto = z.infer<typeof verifyLoginRequestDto>;
