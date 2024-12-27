import { api } from '$lib/tanstack-query/index.js';
import { StatusCodes } from '$lib/utils/status-codes.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, fetch }) => {
	const { queryClient } = await parent();
	const authedUser = await queryClient.fetchQuery(api({ fetch }).users.me());
	if (!authedUser) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
};
