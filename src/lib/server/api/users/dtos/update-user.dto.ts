import type { z } from 'zod';
import { userDto } from './user.dto';

export const updateUserDto = userDto
  .pick({
    avatar: true
  })
  .optional();

export type UpdateUserDto = z.infer<typeof updateUserDto>;
