import type { MiddlewareHandler } from 'hono';
import { getSignedCookie, setSignedCookie } from 'hono/cookie';
import { createMiddleware } from 'hono/factory';
import { generateId } from '../utils/crypto';
import { Container } from '@needle-di/core';
import { ConfigService } from '../configs/config.service';

export const browserSessions: MiddlewareHandler = createMiddleware(async (c, next) => {
  const BROWSER_SESSION_COOKIE_NAME = '_id';
  const container = new Container();
  const configService = container.get(ConfigService);
  const browserSessionCookie = await getSignedCookie(
    c,
    configService.envs.SIGNING_SECRET,
    BROWSER_SESSION_COOKIE_NAME
  );
  let browserSessionId = browserSessionCookie;

  if (!browserSessionCookie) {
    browserSessionId = generateId();
    setSignedCookie(
      c,
      BROWSER_SESSION_COOKIE_NAME,
      browserSessionId,
      configService.envs.SIGNING_SECRET,
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: configService.envs.ENV === 'prod',
        path: '/'
      }
    );
  }

  c.set('browserSessionId', browserSessionId);
  return next();
});
