import 'reflect-metadata';
import { Hono } from 'hono';
import { hc } from 'hono/client';
import { container } from 'tsyringe';
import { IamController } from './controllers/iam.controller';
import { env } from './configs/envs.config';
import { validateAuthSession, verifyOrigin } from './middlewares/auth.middleware';
// import { TestJob } from './jobs/test.job';
import { glob, globSync } from 'glob';
import path from 'path';

console.log('API SERVER STARTED');
/* ----------------------------------- Api ---------------------------------- */
const app = new Hono().basePath('/api');

/* --------------------------- Global Middlewares --------------------------- */
app.use(verifyOrigin).use(validateAuthSession);

/* --------------------------------- Routes --------------------------------- */
const routes = app
	.route('/iam', container.resolve(IamController).routes())

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>(env.ORIGIN);
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
export { app };

async function resolveJobs() {
	const jobFiles = globSync('**/*.job.*');

	for (const file of jobFiles) {
		const module = await import(path.resolve(file));
		container.resolve(module.default)
	}
}

resolveJobs();
