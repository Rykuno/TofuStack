export const load = async ({ locals }) => {
	const user = await locals.getAuthedUser();
	return { user: user };
};
