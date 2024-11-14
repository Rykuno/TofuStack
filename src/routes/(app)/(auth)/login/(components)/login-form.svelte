<script module lang="ts">
	import { z } from 'zod';

	export const loginSchema = z.object({
		email: z.string().email()
	});

	export const verifySchema = z.object({
		email: z.string().email(),
		code: z.string().length(6)
	});
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { superForm, defaults, setError } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { createMutation, useQueryClient } from '@tanstack/svelte-query';
	import { goto } from '$app/navigation';
	import ChevronLeftIcon from 'lucide-svelte/icons/chevron-left';
	import { apiClient } from '$lib/tanstack-query';

	let queryClient = useQueryClient();
	let step = $state<'request' | 'verify'>('request');

	const requestMutation = createMutation({
		...queryClient().iam.requestLogin(),
		onSuccess(_data, variables, _context) {
			step = 'verify';
			$verifyForm.email = variables.json.email;
		},
		onError(error) {
			requestErrors.set({ email: [error.message] });
		}
	});

	async function handleResend() {
		await $requestMutation.mutateAsync({
			json: { email: $verifyForm.email }
		});
	}

	const verifyMutation = createMutation({
		...apiClient.auth.verifyLogin(),
		async onSuccess() {
			await queryClient.invalidateQueries();
			goto('/');
		},
		onError(error) {
			verifyErrors.set({ code: [error.message] });
		}
	});

	const sf_login = superForm(defaults(zod(loginSchema)), {
		resetForm: false,
		SPA: true,
		validators: zod(loginSchema),
		async onUpdated(event) {
			if (!event.form.valid) return;

			await $requestMutation.mutateAsync({
				json: {
					email: event.form.data.email
				}
			});

			if ($requestMutation.error)
				return setError(event.form, 'email', $requestMutation.error.message);

			step = 'verify';
			$verifyForm.email = event.form.data.email;
		}
	});

	const sf_verify = superForm(defaults(zod(verifySchema)), {
		resetForm: false,
		SPA: true,
		validators: zod(verifySchema),
		async onUpdated(event) {
			if (!event.form.valid) return;
			await $verifyMutation.mutateAsync({ json: event.form.data });
		}
	});

	const { form: verifyForm, enhance: verifyEnhance, errors: verifyErrors } = sf_verify;
	const { form: loginForm, enhance: loginEnhance, errors: requestErrors } = sf_login;

	function handleBack() {
		step = 'request';
		sf_verify.reset();
		sf_login.reset();
	}
</script>

{#if step === 'request'}
	{@render requetsCard()}
{/if}
{#if step === 'verify'}
	{@render verifyCard()}
{/if}

{#snippet requetsCard()}
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Card.Title class="text-2xl">Login</Card.Title>
			<Card.Description>Enter your email below to login to your account</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:loginEnhance method="POST" class="grid gap-4">
				<Form.Field form={sf_login} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Email</Form.Label>
							<Input {...props} bind:value={$loginForm.email} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" class="w-full">Continue with Email</Button>
			</form>
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet verifyCard()}
	<Card.Root class="mx-auto w-full max-w-sm">
		<Card.Header>
			<Button onclick={handleBack} class="h-8 w-8" variant="secondary"><ChevronLeftIcon /></Button>
			<Card.Title class="text-2xl">Enter Code</Card.Title>
			<Card.Description
				>Please enter the 6 digit code we sent to {$verifyForm.email}</Card.Description
			>
		</Card.Header>
		<Card.Content>
			<form use:verifyEnhance method="POST" class="grid gap-4">
				<input value={$verifyForm.email} id="email" hidden />
				<Form.Field form={sf_verify} name="code">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Code</Form.Label>
							<Input {...props} bind:value={$verifyForm.code} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" class="w-full">Verify</Button>
			</form>
			<div class="mt-4 text-sm">
				<Button onclick={handleResend} variant="ghost" size="sm">Resend Code</Button>
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
