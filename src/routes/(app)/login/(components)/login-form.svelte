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
	import { api } from '$lib/tanstack-query';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';

	const RESEND_VERIFICATION_CODE_COOLDOWN = 60;

	let queryClient = useQueryClient();
	let step = $state<'request' | 'verify'>('request');
	let countdownTimer = $state(RESEND_VERIFICATION_CODE_COOLDOWN);
	let resendVerificationCodeOnCooldown = $derived(
		countdownTimer != RESEND_VERIFICATION_CODE_COOLDOWN
	);

	/* ----------------------------------- Api ---------------------------------- */
	const requestMutation = createMutation({
		...api().iam.requestLogin(),
		onSuccess(_data, variables, _context) {
			step = 'verify';
			$verifyForm.email = variables.json.email;
			startResendVerificationCodeTimer();
		},
		onError(error) {
			requestErrors.set({ email: [error.message] });
		}
	});

	const verifyMutation = createMutation({
		...api().iam.verifyLogin(),
		async onSuccess() {
			await queryClient.invalidateQueries();
			goto('/');
		},
		onError(error) {
			verifyErrors.set({ code: [error.message] });
		}
	});

	/* ------------------------------- Login Form ------------------------------- */
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
	const { form: loginForm, enhance: loginEnhance, errors: requestErrors } = sf_login;

	/* ------------------------------- Verify Form ------------------------------ */
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

	/* -------------------------------- Functions ------------------------------- */
	function startResendVerificationCodeTimer() {
		countdownTimer = RESEND_VERIFICATION_CODE_COOLDOWN - 1;
		const interval = setInterval(() => {
			countdownTimer -= 1;
			if (countdownTimer <= 0) {
				countdownTimer = RESEND_VERIFICATION_CODE_COOLDOWN;
				clearInterval(interval);
			}
		}, 1000);
	}

	function resetAuthFlow() {
		step = 'request';
		sf_verify.reset();
		sf_login.reset();
	}

	async function resendVerificationCode() {
		startResendVerificationCodeTimer();
		await $requestMutation.mutateAsync({
			json: { email: $verifyForm.email }
		});
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
			<Button onclick={resetAuthFlow} class="h-8 w-8" variant="secondary"
				><ChevronLeftIcon /></Button
			>
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
							<InputOTP.Root maxlength={6} {...props} bind:value={$verifyForm.code}>
								{#snippet children({ cells })}
									<InputOTP.Group>
										{#each cells as cell}
											<InputOTP.Slot {cell} />
										{/each}
									</InputOTP.Group>
								{/snippet}
							</InputOTP.Root>
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
				<Button type="submit" class="w-full">Verify</Button>
			</form>
			<div class="mt-4 text-sm">
				{#if resendVerificationCodeOnCooldown}
					<p>Resend code in {countdownTimer}s</p>
				{:else}
					<Button onclick={resendVerificationCode} variant="ghost" size="sm">Resend Code</Button>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
{/snippet}
