import { parseApiResponse } from '$lib/utils/api';
import type { Api, ApiQuery } from '$lib/utils/types';
import { TanstackQueryModule } from './query-module';

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */
type Me = Api['users']['me']['$get'];

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
}
