import { setCookie } from 'hono/cookie';
import { inject, injectable } from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import { limiter } from '../middlewares/rate-limiter.middlware';
import { requireAuth } from '../middlewares/require-auth.middleware';
import { Controler } from '../common/types/controller';
import { updateEmailDto } from '$lib/server/api/dtos/update-email.dto';
import { verifyEmailDto } from '$lib/server/api/dtos/verify-email.dto';
import { LuciaService } from '../services/lucia.service';
import { AuthenticationService } from '../services/authentication.service';
import { EmailVerificationService } from '../services/email-verification.service';
import { loginDto } from '../dtos/login.dto';
import { verifyLoginDto } from '../dtos/verify-login.dto';

@injectable()
export class AuthenticationController extends Controler {
	constructor(
		@inject(AuthenticationService) private authenticationService: AuthenticationService,
		@inject(EmailVerificationService) private emailVerificationService: EmailVerificationService,
		@inject(LuciaService) private luciaService: LuciaService,
	) {
		super();
	}

	routes() {
		return this.controller
			.get('/me', async (c) => {
				const user = c.var.user;
				return c.json({ user: user });
			})
			.post('/login', zValidator('json', loginDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { email } = c.req.valid('json');
				await this.authenticationService.createLoginRequest({ email });
				return c.json({ message: 'Verification email sent' });
			})
			.post('/login/verify', zValidator('json', verifyLoginDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { email, token } = c.req.valid('json');
				const session = await this.authenticationService.verifyLoginRequest({ email, token });
				const sessionCookie = this.luciaService.lucia.createSessionCookie(session.id);
				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});
				return c.json({ message: 'ok' });
			})
			.patch('/email', requireAuth, zValidator('json', updateEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const json = c.req.valid('json');
				await this.emailVerificationService.create(c.var.user.id, json.email);
				return c.json({ message: 'Verification email sent' });
			})
			// this could also be named to use custom methods, aka /email#verify
			// https://cloud.google.com/apis/design/custom_methods
			.post('/email/verify', requireAuth, zValidator('json', verifyEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const json = c.req.valid('json');
				await this.emailVerificationService.verify(c.var.user.id, json.token);
				return c.json({ message: 'Verified and updated' });
			})
			.post('/logout', requireAuth, async (c) => {
				const sessionId = c.var.session.id;
				await this.authenticationService.logout(sessionId);
				const sessionCookie = this.luciaService.lucia.createBlankSessionCookie();
				setCookie(c, sessionCookie.name, sessionCookie.value, {
					path: sessionCookie.attributes.path,
					maxAge: sessionCookie.attributes.maxAge,
					domain: sessionCookie.attributes.domain,
					sameSite: sessionCookie.attributes.sameSite as any,
					secure: sessionCookie.attributes.secure,
					httpOnly: sessionCookie.attributes.httpOnly,
					expires: sessionCookie.attributes.expires
				});
				return c.json({ status: 'success' });
			})
	}
}
