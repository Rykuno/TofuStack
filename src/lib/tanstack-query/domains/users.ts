import { parseClientResponse } from '$lib/utils/api';
import type { Api, ApiMutation, ApiQuery } from '$lib/utils/types';
import type { InferRequestType } from 'hono';
import { TanstackRequestOptions } from '../request-options';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
export type Me = Api['users']['me']['$get'];
export type UpdateEmailRequest = Api['users']['me']['email']['request']['$post'];
export type VerifyEmailRequest = Api['users']['me']['email']['verify']['$post'];
export type UpdateUser = Api['users']['me']['$patch'];

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class UsersModule extends TanstackRequestOptions {
	namespace = 'users';

	me(): ApiQuery<Me> {
		return {
			queryKey: [this.namespace, 'me'],
			queryFn: async () => await this.api.users.me.$get().then(parseClientResponse)
		};
	}

	update(): ApiMutation<UpdateUser> {
		return {
			mutationFn: async (args: InferRequestType<UpdateUser>) =>
				await this.api.users.me.$patch(args).then(parseClientResponse)
		};
	}

	updateEmailRequest(): ApiMutation<UpdateEmailRequest> {
		return {
			mutationFn: async (args: InferRequestType<UpdateEmailRequest>) =>
				await this.api.users.me.email.request.$post(args).then(parseClientResponse)
		};
	}

	verifyEmailRequest(): ApiMutation<VerifyEmailRequest> {
		return {
			mutationFn: async (args: InferRequestType<VerifyEmailRequest>) =>
				await this.api.users.me.email.verify.$post(args).then(parseClientResponse)
		};
	}
}
