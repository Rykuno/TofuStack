<script lang="ts" module>
	import { z } from 'zod';

	const requestFormSchema = z.object({
		email: z.string().email()
	});

	const verifyFormSchema = z.object({
		code: z.string().length(6)
	});
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { queryHandler } from '$lib/tanstack-query';
	import { createMutation } from '@tanstack/svelte-query';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as InputOTP from '$lib/components/ui/input-otp/index.js';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import * as Form from '$lib/components/ui/form';
	import { authContext } from '$lib/hooks/session.svelte';
	import { invalidateAll } from '$app/navigation';

	let verifyDialogOpen = $state(false);
	let { data } = $props();

	const updateEmailRequestMutation = createMutation({
		mutationFn: queryHandler().users.updateEmailRequest().mutationFn,
		onError: (error) => {
			updateEmailRequestErrors.set({ email: [error.message] });
		},
		onSuccess: async () => {
			verifyDialogOpen = true;
		}
	});

	const verifyEmailRequestMutation = createMutation({
		mutationFn: queryHandler().users.verifyEmailRequest().mutationFn,
		onError: (error) => {
			verifyEmailRequestErrors.set({ code: [error.message] });
		},
		onSuccess: async () => {
			await invalidateAll();
			await data.queryClient.invalidateQueries();
			verifyDialogOpen = false;
		}
	});

	const sf_verifyEmailRequestForm = superForm(defaults(zod(verifyFormSchema)), {
		SPA: true,
		resetForm: false,
		validators: zod(verifyFormSchema),
		onUpdated({ form }) {
			if (!form.valid) return;
			$verifyEmailRequestMutation.mutate({
				json: {
					code: form.data.code
				}
			});
		}
	});

	const {
		form: verifyEmailRequestFormData,
		enhance: verifyEmailRequestEnhance,
		submit: verifyEmailRequestSubmit,
		errors: verifyEmailRequestErrors
	} = sf_verifyEmailRequestForm;

	const sf_updateEmailRequestForm = superForm(
		defaults(authContext.authedUser, zod(requestFormSchema)),
		{
			SPA: true,
			resetForm: false,
			validators: zod(requestFormSchema),
			async onUpdated({ form }) {
				if (!form.valid) return;
				$updateEmailRequestMutation.mutate({
					json: {
						email: form.data.email
					}
				});
			}
		}
	);
	const {
		form: updateEmailRequestFormData,
		enhance: updateEmailRequestEnhance,
		submit: updateEmailRequestSubmit,
		errors: updateEmailRequestErrors
	} = sf_updateEmailRequestForm;
</script>

<div class="grid gap-6">
	<Card.Root>
		<Card.Header>
			<Card.Title>Email</Card.Title>
			<Card.Description>Update and manage your email address</Card.Description>
		</Card.Header>
		<Card.Content>
			<form use:updateEmailRequestEnhance method="POST" class="grid gap-4">
				<Form.Field form={sf_updateEmailRequestForm} name="email">
					<Form.Control>
						{#snippet children({ props })}
							<Input {...props} bind:value={$updateEmailRequestFormData.email} />
						{/snippet}
					</Form.Control>
					<Form.Description />
					<Form.FieldErrors />
				</Form.Field>
			</form>
		</Card.Content>
		<Card.Footer class="border-t px-6 py-4">
			<Button onclick={updateEmailRequestSubmit}>Save</Button>
		</Card.Footer>
	</Card.Root>
</div>

<Dialog.Root bind:open={verifyDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Verify Email</Dialog.Title>
			<Dialog.Description>
				We have sent a code to your email address. Please enter the code to verify your email.
			</Dialog.Description>
		</Dialog.Header>
		<form use:verifyEmailRequestEnhance method="POST" class="grid gap-4">
			<Form.Field form={sf_verifyEmailRequestForm} name="code">
				<Form.Control>
					{#snippet children({ props })}
						<InputOTP.Root maxlength={6} {...props} bind:value={$verifyEmailRequestFormData.code}>
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
		</form>
		<Dialog.Footer>
			<Button variant="outline">Cancel</Button>
			<Button onclick={verifyEmailRequestSubmit}>Verify</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
