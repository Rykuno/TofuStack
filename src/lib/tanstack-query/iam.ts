import type { InferRequestType } from 'hono';
import { parseApiResponse } from '$lib/utils/api';
import type { Api, ApiMutation } from '$lib/utils/types';
import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
type RequestLogin = Api['iam']['login']['request']['$post'];
type VerifyLogin = Api['iam']['login']['verify']['$post'];
type Logout = Api['iam']['logout']['$post'];

/* -------------------------------------------------------------------------- */
/*                                     Api                                    */
/* -------------------------------------------------------------------------- */
export class IamModule extends TanstackQueryModule<'iam'> {
	logout(): ApiMutation<Logout> {
		return {
			mutationFn: async () => await this.api.iam.logout.$post().then(parseApiResponse)
		};
	}
	requestLogin(): ApiMutation<RequestLogin> {
		return {
			mutationFn: async (data: InferRequestType<RequestLogin>) =>
				await this.api.iam.login.request.$post(data).then(parseApiResponse)
		};
	}
	verifyLogin(): ApiMutation<VerifyLogin> {
		return {
			mutationFn: async (data: InferRequestType<VerifyLogin>) =>
				await this.api.iam.login.verify.$post(data).then(parseApiResponse)
		};
	}
}
