import { IamModule } from './iam';
import type { ClientRequestOptions } from 'hono';
import { UsersModule } from './users';
import { TanstackQueryModule } from './query-module';

class TanstackQueryApiClient extends TanstackQueryModule {
	iam = new IamModule(this.opts);
	users = new UsersModule(this.opts);
}

export const apiClient = (opts?: ClientRequestOptions) => new TanstackQueryApiClient(opts);
