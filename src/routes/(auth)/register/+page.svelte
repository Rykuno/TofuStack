<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { superForm } from 'sveltekit-superforms';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import PinInput from '$lib/components/pin-input.svelte';
	import { registerFormSchema, signInFormSchema } from './schemas.js';

	const { data } = $props();

	let showTokenVerification = $state(false);

	const emailRegisterForm = superForm(data.emailRegisterForm, {
		validators: zodClient(registerFormSchema),
		resetForm: false,
		onUpdated: ({ form }) => {
			if (form.valid) {
				showTokenVerification = true;
				$emailSigninFormData.email = form.data.email;
			}
		}
	});

	const emailSigninForm = superForm(data.emailSigninForm, {
		validators: zodClient(signInFormSchema),
		resetForm: false
	});

	const { form: emailRegisterFormData, enhance: emailRegisterEnhance } = emailRegisterForm;
	const { form: emailSigninFormData, enhance: emailSigninEnhance } = emailSigninForm;
</script>

<Card.Root class="mx-auto mt-24 max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<div class="grid gap-4">
			{#if showTokenVerification}
				{@render tokenForm()}
			{:else}
				{@render emailForm()}
			{/if}
			<!-- <Button variant="outline" class="w-full">Login with Discord</Button> -->
		</div>
		<div class="mt-4 text-center text-sm">
			By registering, you agree to our <a href="##" class="underline">Terms of Service</a>
		</div>
	</Card.Content>
</Card.Root>

{#snippet emailForm()}
	<form method="POST" action="?/register" use:emailRegisterEnhance class="grid gap-4">
		<Form.Field form={emailRegisterForm} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input
					{...attrs}
					type="email"
					placeholder="you@awesome.com"
					bind:value={$emailRegisterFormData.email}
				/>
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button type="submit" class="w-full">Continue with Email</Button>
	</form>
{/snippet}

{#snippet tokenForm()}
	<form method="POST" action="?/signin" use:emailSigninEnhance class="space-y-4">
		<input hidden value={$emailSigninFormData.email} name="email" />
		<Form.Field form={emailSigninForm} name="token">
			<Form.Control let:attrs>
				<Form.Label />
				<PinInput class="justify-evenly" {...attrs} bind:value={$emailSigninFormData.token} />
			</Form.Control>
			<Form.Description />
			<Form.FieldErrors />
		</Form.Field>
		<Button class="w-full" type="submit">Submit</Button>
	</form>
{/snippet}
