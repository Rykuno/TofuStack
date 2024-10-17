import { fail, redirect } from '@sveltejs/kit';
import { zod } from 'sveltekit-superforms/adapters';
import { StatusCodes } from '$lib/constants/status-codes';
import { setError, superValidate } from 'sveltekit-superforms';
import { registerFormSchema, signInFormSchema } from './schemas';

export const load = async () => {
	return {
		emailRegisterForm: await superValidate(zod(registerFormSchema)),
		emailSigninForm: await superValidate({email: 'test'}, zod(signInFormSchema))
	};
};

export const actions = {
	register: async ({ locals, request }) => {
		const emailRegisterForm = await superValidate(request, zod(registerFormSchema));
		if (!emailRegisterForm.valid) return fail(StatusCodes.BAD_REQUEST, { emailRegisterForm });
		const { error } = await locals.api.auth.login.$post({ json: emailRegisterForm.data }).then(locals.parseApiResponse);
		if (error) return setError(emailRegisterForm, 'email', error);
		return { emailRegisterForm };
	},
	signin: async ({ locals, request }) => {
		const emailSignInForm = await superValidate(request, zod(signInFormSchema));
		if (!emailSignInForm.valid) return fail(StatusCodes.BAD_REQUEST, { emailSignInForm });
		const { error } = await locals.api.auth.login.verify.$post({ json: emailSignInForm.data }).then(locals.parseApiResponse)
		if (error) return setError(emailSignInForm, 'token', error);
		redirect(301, '/');
	}
};
