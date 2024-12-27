import type { ApiRoutes } from '$lib/server/api';
import type { ClientRequestOptions } from 'hono';
import { hc, type ClientResponse } from 'hono/client';

export const honoClient = (options?: ClientRequestOptions) => hc<ApiRoutes>('/', options).api;

export async function parseClientResponse<T>(response: ClientResponse<T>) {
	if (response.ok) {
		return response.json() as T;
	}

	// handle errors
	const error = await response.text();
	try {
		const jsonError = JSON.parse(error); // attempt to parse as JSON
		throw new Error(jsonError);
	} catch {
		throw new Error(error);
	}
}
