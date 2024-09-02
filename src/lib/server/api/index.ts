import 'reflect-metadata';
import { Hono } from 'hono';
import { hc } from 'hono/client';
import { container } from 'tsyringe';
import { IamController } from './controllers/iam.controller';
import { config, env } from './common/config';
import { validateAuthSession, verifyOrigin } from './middlewares/auth.middleware';
import { AuthCleanupJobs } from './jobs/auth-cleanup.job';

/* -------------------------------------------------------------------------- */
/*                                     App                                    */
/* -------------------------------------------------------------------------- */
export const app = new Hono().basePath('/api');

/* -------------------------------------------------------------------------- */
/*                             Global Middlewares                             */
/* -------------------------------------------------------------------------- */
app.use(verifyOrigin).use(validateAuthSession);

/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const routes = app
	.route('/iam', container.resolve(IamController).routes())

/* -------------------------------------------------------------------------- */
/*                                  Cron Jobs                                 */
/* -------------------------------------------------------------------------- */
container.resolve(AuthCleanupJobs).deleteStaleEmailVerificationRequests();
container.resolve(AuthCleanupJobs).deleteStaleLoginRequests();

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
const rpc = hc<typeof routes>(config.api.origin);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;




