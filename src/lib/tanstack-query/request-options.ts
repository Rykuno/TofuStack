import type { ClientRequestOptions } from 'hono';
import { honoClient } from '$lib/utils/api';

export abstract class TanstackRequestOptions {
	protected readonly opts: ClientRequestOptions | undefined;
	protected readonly api: ReturnType<typeof honoClient>;

	constructor(opts?: ClientRequestOptions) {
		this.opts = opts;
		this.api = honoClient(opts);
	}
}
