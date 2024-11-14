import { Hono } from 'hono';
import type { SessionDto } from '../../iam/sessions/dtos/session.dto';

export type HonoEnv = {
  Variables: {
    session: SessionDto | null;
    browserSessionId: string;
    requestId: string;
  };
};

export function createHono() {
  return new Hono<HonoEnv>();
}
