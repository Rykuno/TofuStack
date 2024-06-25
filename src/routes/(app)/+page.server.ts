export const load = async ({ locals }) => {
	const user = await locals.getAuthedUser();
	return { user: user };
};


export const actions = {
	logout: async ({ locals }) => {
		console.log("Logging out")
		await locals.api.iam.logout.$post()
	}
}