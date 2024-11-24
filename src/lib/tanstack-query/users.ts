import { parseApiResponse } from '$lib/utils/api';
import type { Api, ApiMutation, ApiQuery } from '$lib/utils/types';
import type { InferRequestType } from 'hono';
import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
type Me = Api['users']['me']['$get'];
type UpdateEmailRequest = Api['users']['me']['email']['request']['$post'];
type VerifyEmailRequest = Api['users']['me']['email']['verify']['$post'];

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class UsersModule extends TanstackQueryModule<'users'> {
	me(): ApiQuery<Me> {
		return {
			queryKey: [this.namespace, 'me'],
			queryFn: async () => await this.api.users.me.$get().then(parseApiResponse)
		};
	}

	updateEmailRequest(): ApiMutation<UpdateEmailRequest> {
		return {
			mutationFn: async (args: InferRequestType<UpdateEmailRequest>) =>
				await this.api.users.me.email.request.$post(args).then(parseApiResponse)
		};
	}

	verifyEmailRequest(): ApiMutation<VerifyEmailRequest> {
		return {
			mutationFn: async (args: InferRequestType<VerifyEmailRequest>) =>
				await this.api.users.me.email.verify.$post(args).then(parseApiResponse)
		};
	}
}
