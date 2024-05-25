import 'reflect-metadata';
import './providers';
import { Hono } from 'hono';
import { hc } from 'hono/client';
import { container } from 'tsyringe';
import { processAuth } from './middleware/process-auth.middleware';
import { IamController } from './controllers/iam.controller';

/* -------------------------------------------------------------------------- */
/*                                     API                                    */
/* -------------------------------------------------------------------------- */
const app = new Hono().basePath('/api');

/* -------------------------------------------------------------------------- */
/*                             Global Middlewares                             */
/* -------------------------------------------------------------------------- */
app.use(processAuth); // all this does is set the session and user variables in the request object
/* -------------------------------------------------------------------------- */
/*                                   Routes                                   */
/* -------------------------------------------------------------------------- */
const routes = app
	.route('/iam', container.resolve(IamController).registerEmail())
	.route('/iam', container.resolve(IamController).signInEmail())
	.route('/iam', container.resolve(IamController).getAuthedUser())
	.route('/iam', container.resolve(IamController).updateEmail())
	.route('/iam', container.resolve(IamController).verifyEmail());

/* -------------------------------------------------------------------------- */
/*                                   Exports                                  */
/* -------------------------------------------------------------------------- */
export const rpc = hc<typeof routes>('http://localhost:5173');
export type ApiClient = typeof rpc;
export type ApiRoutes = typeof routes;
export { app };
