import { StatusCodes } from "$lib/constants/status-codes";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
	const user = await locals.getAuthedUser();
	return { user: user };
};

export const actions = {
	logout: async ({ locals }) => {
		await locals.api.iam.logout.$post()
		redirect(StatusCodes.SEE_OTHER, '/register')
	}
}

