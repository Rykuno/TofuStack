import { Hono } from 'hono';
import { setCookie } from 'hono/cookie';
import type { HonoTypes } from '../types';
import { inject, injectable } from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import { IamService } from '../services/iam.service';
import { LuciaProvider } from '../providers/lucia.provider';
import { requireAuth } from '../middleware/auth.middleware';
import { limiter } from '../middleware/rate-limiter.middlware';
import { signInEmailDto } from '../../../dtos/signin-email.dto';
import { updateEmailDto } from '../../../dtos/update-email.dto';
import { verifyEmailDto } from '../../../dtos/verify-email.dto';
import { registerEmailDto } from '../../../dtos/register-email.dto';
import type { Controller } from '../interfaces/controller.interface';
import { EmailVerificationsService } from '../services/email-verifications.service';
import { LoginRequestsService } from '../services/login-requests.service';

/* -------------------------------------------------------------------------- */
/*                                 Controller                                 */
/* -------------------------------------------------------------------------- */
/* -------------------------------------------------------------------------- */
/* ---------------------------------- About --------------------------------- */
/* 
Controllers are responsible for handling incoming requests and returning responses
to a client.
*/
/* ---------------------------------- Notes --------------------------------- */
/*
A controller should generally only handle routing and authorization through 
middleware. 

Any business logic should be delegated to a service. This keeps the controller 
clean and easy to read.
*/
/* -------------------------------- Important ------------------------------- */
/*
Remember to register your controller in the api/index.ts file.
*/
/* -------------------------------------------------------------------------- */

@injectable()
export class IamController implements Controller {
	controller = new Hono<HonoTypes>();

	constructor(
		@inject(IamService) private iamService: IamService,
		@inject(LoginRequestsService) private loginRequestsService: LoginRequestsService,
		@inject(EmailVerificationsService) private emailVerificationsService: EmailVerificationsService,
		@inject(LuciaProvider) private lucia: LuciaProvider
	) { }

	routes() {
		return this.controller
			.get('/user', async (c) => {
				const user = c.var.user;
				return c.json({ user: user });
			})
			.post('/login/request', zValidator('json', registerEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { email } = c.req.valid('json');
				await this.loginRequestsService.create({ email });
				return c.json({ message: 'Verification email sent' });
			})
			.post('/login/verify', zValidator('json', signInEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const { email, token } = c.req.valid('json');
				const session = await this.loginRequestsService.verify({ email, token });
				const sessionCookie = this.lucia.createSessionCookie(session.id);
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
			.post('/logout', requireAuth, async (c) => {
				const sessionId = c.var.session.id;
				await this.iamService.logout(sessionId);
				const sessionCookie = this.lucia.createBlankSessionCookie();
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
			.patch('/email', requireAuth, zValidator('json', updateEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const json = c.req.valid('json');
				await this.emailVerificationsService.dispatchEmailVerificationRequest(c.var.user.id, json.email);
				return c.json({ message: 'Verification email sent' });
			})
			// this could also be named to use custom methods, aka /email:verify
			// https://cloud.google.com/apis/design/custom_methods
			.post('/email/verification', requireAuth, zValidator('json', verifyEmailDto), limiter({ limit: 10, minutes: 60 }), async (c) => {
				const json = c.req.valid('json');
				await this.emailVerificationsService.processEmailVerificationRequest(c.var.user.id, json.token);
				return c.json({ message: 'Verified and updated' });
			});
	}
}
