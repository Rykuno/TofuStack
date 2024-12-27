import { api } from '$lib/tanstack-query';

export const load = async ({ parent, fetch }) => {
	const { queryClient } = await parent();
	await queryClient.prefetchQuery({ ...api({ fetch }).users.me() });
	return {};
};
