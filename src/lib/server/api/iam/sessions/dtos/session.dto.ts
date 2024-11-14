import { z } from "zod";

export const sessionDto = z.object({
  id: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  createdAt: z.date(),
  fresh: z.boolean(),
})

export type SessionDto = z.infer<typeof sessionDto>;