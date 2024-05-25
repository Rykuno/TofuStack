export const load = async ({ locals }) => {
	const authedUser = await locals.getAuthedUserOrThrow();

	return {
		authedUser
	};
};

export const actions = {
	updateEmail: async ({ request, locals }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString()!;

		await locals.api.iam.email.update.$post({ json: { email } });
	},
	verifyEmail: async ({ request, locals }) => {
		const data = await request.formData();
		const token = data.get('token')?.toString()!;

		await locals.api.iam.email.verify.$post({ json: { token } });
	}
};
