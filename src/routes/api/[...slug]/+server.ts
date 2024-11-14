import { routes } from '$lib/server/api';
import type { RequestHandler } from '@sveltejs/kit';

export const fallback: RequestHandler = ({ request }) => routes.fetch(request);
