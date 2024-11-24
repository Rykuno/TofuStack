import type { ClientRequestOptions } from 'hono';
import { api } from '$lib/utils/api';

export abstract class TanstackQueryModule<T extends string | null = null> {
	protected readonly opts: ClientRequestOptions | undefined;
	protected readonly api: ReturnType<typeof api>;
	public namespace: T | null = null;

	constructor(opts?: ClientRequestOptions) {
		this.opts = opts;
		this.api = api(opts);
	}
}
