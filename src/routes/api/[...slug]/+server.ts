import { routes } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const fallback: RequestHandler = ({ request, getClientAddress }) => {
	request.headers.set('x-forwarded-for', getClientAddress());
	return routes.fetch(request);
};
