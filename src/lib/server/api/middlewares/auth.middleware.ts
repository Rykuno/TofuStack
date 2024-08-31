import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { verifyRequestOrigin } from 'lucia';
import type { Session, User } from 'lucia';
import { Unauthorized } from '../common/exceptions';
import type { HonoTypes } from '../common/types/hono.type';
import { lucia } from '../packages/lucia';

export const verifyOrigin: MiddlewareHandler<HonoTypes> = createMiddleware(async (c, next) => {
	if (c.req.method === "GET") {
		return next();
	}
	const originHeader = c.req.header("Origin") ?? null;
	const hostHeader = c.req.header("Host") ?? null;
	if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
		return c.body(null, 403);
	}
	return next();
})

export const validateAuthSession: MiddlewareHandler<HonoTypes> = createMiddleware(async (c, next) => {
	const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
	if (!sessionId) {
		c.set("user", null);
		c.set("session", null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), { append: true });
	}
	if (!session) {
		c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), { append: true });
	}
	c.set("session", session);
	c.set("user", user);
	return next();
})

export const requireAuth: MiddlewareHandler<{
	Variables: {
		session: Session;
		user: User;
	};
}> = createMiddleware(async (c, next) => {
	const user = c.var.user;
	if (!user) throw Unauthorized('You must be logged in to access this resource');
	return next();
});
