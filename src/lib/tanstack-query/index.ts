import { IamModule } from './domains/iam';
import type { ClientRequestOptions } from 'hono';
import { UsersModule } from './domains/users';
import { TanstackRequestOptions } from './request-options';

class TanstackQueryModule extends TanstackRequestOptions {
	iam = new IamModule(this.opts);
	users = new UsersModule(this.opts);
}

export const api = (opts?: ClientRequestOptions) => new TanstackQueryModule(opts);
