import { StatusCodes } from '$lib/utils/status-codes.js';
import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { authedUser } = await parent();
	if (!authedUser) throw redirect(StatusCodes.TEMPORARY_REDIRECT, '/');
	return {};
};
