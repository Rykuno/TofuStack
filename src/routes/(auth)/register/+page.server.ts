import { registerEmailDto } from '$lib/dtos/register-email.dto.js';
import { signInEmailDto } from '$lib/dtos/signin-email.dto.js';
import { fail, redirect } from '@sveltejs/kit';
import { setError, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
	return {
		emailRegisterForm: await superValidate(zod(registerEmailDto)),
		emailSigninForm: await superValidate(zod(signInEmailDto))
	};
};

export const actions = {
	register: async ({ locals, request }) => {
		const emailRegisterForm = await superValidate(request, zod(registerEmailDto));
		if (!emailRegisterForm.valid) return fail(400, { emailRegisterForm });
		const { error } = await locals.api.iam.email.register.$post({ json: emailRegisterForm.data }).then(locals.parseApiResponse);
		if (error) return setError(emailRegisterForm, 'email', error);
		return { emailRegisterForm };
	},
	signin: async ({ locals, request }) => {
		const emailSignInForm = await superValidate(request, zod(signInEmailDto));
		if (!emailSignInForm.valid) return fail(400, { emailSignInForm });
		const { error } = await locals.api.iam.email.signin.$post({ json: emailSignInForm.data }).then(locals.parseApiResponse)
		if (error) return setError(emailSignInForm, 'token', error);
		redirect(301, '/');
	}
};
