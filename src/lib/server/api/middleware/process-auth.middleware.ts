import type { MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie } from 'hono/cookie';
import type { HonoTypes } from '../types';
import { lucia } from '../common/lucia';

export const processAuth: MiddlewareHandler<HonoTypes> = createMiddleware(async (c, next) => {
	const sessionId = getCookie(c, 'auth_session');

	if (!sessionId) {
		c.set('session', null);
		c.set('user', null);
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);
	if (session && session.fresh) {
		const cookie = lucia.createSessionCookie(session.id);
		setCookie(c, cookie.name, cookie.value, {
			path: cookie.attributes.path,
			maxAge: cookie.attributes.maxAge,
			domain: cookie.attributes.domain,
			sameSite: cookie.attributes.sameSite as any,
			secure: cookie.attributes.secure,
			httpOnly: cookie.attributes.httpOnly,
			expires: cookie.attributes.expires
		});
	}

	if (!session) {
		const cookie = lucia.createBlankSessionCookie();
		setCookie(c, cookie.name, cookie.value, {
			path: cookie.attributes.path,
			maxAge: cookie.attributes.maxAge,
			domain: cookie.attributes.domain,
			sameSite: cookie.attributes.sameSite as any,
			secure: cookie.attributes.secure,
			httpOnly: cookie.attributes.httpOnly,
			expires: cookie.attributes.expires
		});
	}

	c.set('session', session);
	c.set('user', user);
	return next();
});
