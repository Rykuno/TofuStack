import { hc, type ClientResponse } from 'hono/client';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import type { ApiRoutes } from '$lib/server/api';
import { parseApiResponse } from '$lib/helpers';

const apiClient: Handle = async ({ event, resolve }) => {
	const { api } = hc<ApiRoutes>('/', {
		fetch: event.fetch,
		headers: {
			'x-forwarded-for': event.getClientAddress()
		}
	});

	async function getAuthedUser() {
		const { data } = await parseApiResponse(api.iam.user.$get());
		return data && data.user;
	}

	async function getAuthedUserOrThrow() {
		const { data } = await parseApiResponse(api.iam.user.$get());
		if (!data || !data.user) throw redirect(307, '/');
		return data?.user;
	}

	// set contexts
	event.locals.api = api;
	event.locals.getAuthedUser = getAuthedUser;
	event.locals.getAuthedUserOrThrow = getAuthedUserOrThrow;

	const response = await resolve(event);
	return response;
};

export const handle = sequence(apiClient);
