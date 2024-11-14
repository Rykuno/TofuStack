import type { ClientRequestOptions } from 'hono';
import { apiClient } from '$lib/utils/api';

export class TanstackQueryModule<T extends string | null = null> {
	protected readonly opts: ClientRequestOptions | undefined;
	protected readonly api: ReturnType<typeof apiClient>;
	public namespace: T | null = null;

	constructor(opts?: ClientRequestOptions) {
		this.opts = opts;
		this.api = apiClient(opts);
	}
}
