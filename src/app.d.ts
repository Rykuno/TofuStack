import { ApiClient } from '$lib/server/api';
import type { User } from 'lucia';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ApiClient['api'];
			getAuthedUser: () => Promise<Returned<User> | null>;
			getAuthedUserOrThrow: () => Promise<Returned<User>>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
