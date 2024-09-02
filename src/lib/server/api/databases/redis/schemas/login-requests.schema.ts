import { Schema } from 'redis-om'

export const loginRequestSchema = new Schema('album', {
  id: { type: 'string' },
  hashedToken: { type: 'string' },
  email: { type: 'string' },
})