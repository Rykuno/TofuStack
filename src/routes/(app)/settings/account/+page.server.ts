import { updateEmailDto } from "$lib/dtos/update-email.dto.js";
import { verifyEmailDto } from "$lib/dtos/verify-email.dto.js";
import { fail, setError, superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";

export let load = async (event) => {
	const authedUser = await event.locals.getAuthedUserOrThrow()

	return {
		authedUser,
		updateEmailForm: await superValidate(authedUser, zod(updateEmailDto)),
		verifyEmailForm: await superValidate(zod(verifyEmailDto))
	};
};

export const actions = {
	updateEmail: async ({ request, locals }) => {
		const updateEmailForm = await superValidate(request, zod(updateEmailDto));
		if (!updateEmailForm.valid) return fail(400, { updateEmailForm })
		const { data, error } = await locals.api.iam.email.update.$post({ json: updateEmailForm.data }).then(locals.parseApiResponse);
		if (error) return setError(updateEmailForm, 'email', error);
		return { updateEmailForm }
	},
	verifyEmail: async ({ request, locals }) => {
		const verifyEmailForm = await superValidate(request, zod(verifyEmailDto));
		console.log(verifyEmailForm)
		if (!verifyEmailForm.valid) return fail(400, { verifyEmailForm })
		const { error } = await locals.api.iam.email.verify.$post({ json: verifyEmailForm.data }).then(locals.parseApiResponse);
		if (error) return setError(verifyEmailForm, 'token', error);
		return { verifyEmailForm }
	}
};
