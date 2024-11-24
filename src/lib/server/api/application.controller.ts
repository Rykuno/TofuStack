import { inject, injectable } from '@needle-di/core';
import { contextStorage } from 'hono/context-storage';
import { sessionManagement } from './common/middleware/session-managment.middleware';
import { rateLimit } from './common/middleware/rate-limit.middleware';
import { RootController } from './common/factories/controllers.factory';
import { requestId } from 'hono/request-id';
import { generateId } from './common/utils/crypto';
import { UsersController } from './users/users.controller';
import { browserSessions } from './common/middleware/browser-session.middleware';
import { IamController } from './iam/iam.controller';

@injectable()
export class ApplicationController extends RootController {
	constructor(
		private iamController = inject(IamController),
		private usersController = inject(UsersController)
	) {
		super();
	}

	routes() {
		return this.controller
			.get('/', (c) => {
				return c.json({ status: 'ok' });
			})
			.get('/healthz', (c) => {
				return c.json({ status: 'ok' });
			})
			.get('/rate-limit', rateLimit({ limit: 3, minutes: 1 }), (c) => {
				return c.json({ message: 'Test!' });
			});
	}

	registerControllers() {
		return this.controller
			.basePath('/api')
			.use(requestId({ generator: () => generateId() }))
			.use(contextStorage())
			.use(browserSessions)
			.use(sessionManagement)
			.route('/', this.routes())
			.route('/iam', this.iamController.routes())
			.route('/users', this.usersController.routes());
	}
}
