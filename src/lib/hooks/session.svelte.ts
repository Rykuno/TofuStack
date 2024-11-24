import type { Api } from '$lib/utils/types';
import type { InferResponseType } from 'hono';

type Me = InferResponseType<Api['users']['me']['$get']>;

class AuthContext {
	#authedUser = $state<Me>(null);
	isAuthed = $derived(!!this.#authedUser);

	get authedUser() {
		return this.#authedUser;
	}

	// I like to be explicit when setting the authed user
	setAuthedUser(user: Me) {
		this.#authedUser = user;
	}
}

export const authContext = new AuthContext();
