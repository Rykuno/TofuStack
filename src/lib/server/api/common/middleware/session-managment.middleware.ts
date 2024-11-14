import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { Container } from '@needle-di/core';
import { SessionsService } from '../../iam/sessions/sessions.service';

export const sessionManagement: MiddlewareHandler = createMiddleware(async (c, next) => {
  const container = new Container();
  const sessionService = container.get(SessionsService);
  const sessionId = await sessionService.getSessionCookie();

  if (!sessionId) {
    c.set('session', null);
    return next();
  }

  // Validate the session
  const session = await sessionService.validateSession(sessionId);

  // If the session is not found, delete the cookie
  if (!session) sessionService.deleteSessionCookie();

  // If the session is fresh, refresh the cookie with the new expiration date
  if (session && session.fresh) sessionService.setSessionCookie(session);

  // Set the session in the context
  c.set('session', session);

  // Continue to the next middleware
  return next();
});
