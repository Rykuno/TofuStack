import { ApiClient } from '$lib/server/api';
import type { User } from 'lucia';
import { parseApiResponse } from '$lib/utils/api'
import type { Security } from '$lib/utils/security';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ApiClient['api'];
			parseApiResponse: typeof parseApiResponse;
			getAuthedUser: () => Promise<Returned<User> | null>;
			getAuthedUserOrThrow: () => Promise<Returned<User>>;
		}

		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		namespace Superforms {
			type Message = {
				type: 'error' | 'success',
				text: string
			}
		}
	}
}

export { };
