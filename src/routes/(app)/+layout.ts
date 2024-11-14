import { apiClient } from '$lib/tanstack-query';

export const load = async ({ parent, fetch }) => {
	const { queryClient } = await parent();
	queryClient.prefetchQuery(apiClient({ fetch }).users.me());
	const authedUser = queryClient.fetchQuery(apiClient({ fetch }).users.me());
	return { authedUser };
};
