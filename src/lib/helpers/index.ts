import type { ClientResponse } from 'hono/client';

export async function parseApiResponse<T>(fetchCall: Promise<ClientResponse<T>>) {
	const response = await fetchCall;

	if (response.status === 204 || response.headers.get('Content-Length') === '0') {
		return response.ok
			? { data: null, error: null, response }
			: { data: null, error: 'An unknown error has occured', response };
	}

	if (response.ok) {
		const data = await response.json()!;

		return { data, error: null, status: response.status };
	}

	// handle errors
	let error = await response.text();
	try {
		error = JSON.parse(error); // attempt to parse as JSON
	} catch {
		// noop
	}
	return { data: null, error, response };
}

export function getTimezoneAbbr(timezone: string) {
	return new Intl.DateTimeFormat('en-US', {
		timeZone: timezone,
		timeZoneName: 'short'
	})
		.format(new Date())
		.split(' ')[1];
}
