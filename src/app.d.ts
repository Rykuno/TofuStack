import { ApiClient } from '$lib/server/api';
import type { User } from 'lucia';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			api: ApiClient['api'];
			getAuthedUser: () => Promise<User | null>;
			getAuthedUserOrThrow: () => Promise<User>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
