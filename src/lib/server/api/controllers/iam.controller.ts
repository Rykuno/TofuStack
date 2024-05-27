import { inject, injectable } from 'tsyringe';
import { zValidator } from '@hono/zod-validator';
import { registerEmailDto } from '../dtos/register-email.dto';
import { IamService } from '../services/iam.service';
import { signInEmailDto } from '../dtos/signin-email.dto';
import { setCookie } from 'hono/cookie';
import { LuciaProvider } from '../providers/lucia.provider';
import { requireAuth } from '../middleware/require-auth.middleware';
import { updateEmailDto } from '../dtos/update-email.dto';
import { verifyEmailDto } from '../dtos/verify-email.dto';
import { Hono } from 'hono';
import type { HonoTypes } from '../types';
import type { Controller } from '../interfaces/controller.interface';

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
		@inject(LuciaProvider) private lucia: LuciaProvider
	) {}

	routes() {
		return this.controller
			.get('/user', async (c) => {
				const user = c.var.user;
				return c.json({ user: user });
			})
			.post('/email/register', zValidator('json', registerEmailDto), async (c) => {
				const { email } = c.req.valid('json');
				await this.iamService.registerEmail({ email });
				return c.json({ message: 'Verification email sent' });
			})
			.post('/email/signin', zValidator('json', signInEmailDto), async (c) => {
				const { email, token } = c.req.valid('json');
				const session = await this.iamService.signinEmail({ email, token });
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
			.post('/email/update', requireAuth, zValidator('json', updateEmailDto), async (c) => {
				const json = c.req.valid('json');
				await this.iamService.updateEmail(c.var.user.id, json);
				return c.json({ message: 'Verification email sent' });
			})
			.post('/email/verify', requireAuth, zValidator('json', verifyEmailDto), async (c) => {
				const json = c.req.valid('json');
				await this.iamService.verifyEmail(c.var.user.id, json.token);
				return c.json({ message: 'Verified and updated' });
			});
	}
}
