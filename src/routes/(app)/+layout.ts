import { queryHandler } from '$lib/tanstack-query';

export const load = async ({ parent, fetch }) => {
	const { queryClient } = await parent();
	const authedUser = await queryClient.fetchQuery(queryHandler({ fetch }).users.me());
	return { authedUser };
};
