<script context="module">
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import type { updateEmailDto } from '$lib/dtos/update-email.dto';
	import type { verifyEmailDto } from '$lib/dtos/verify-email.dto';

	export type UpdateEmailCardProps = {
		updateEmailForm: SuperValidated<Infer<typeof updateEmailDto>>;
		verifyEmailForm: SuperValidated<Infer<typeof verifyEmailDto>>;
	};
</script>

<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form';
	import { superForm } from 'sveltekit-superforms';
	import * as Dialog from '$lib/components/ui/dialog';
	import PinInput from '$lib/components/pin-input.svelte';
	import { toastMessage } from '$lib/utils/superforms';

	/* ---------------------------------- props --------------------------------- */
	let { updateEmailForm, verifyEmailForm }: UpdateEmailCardProps = $props();

	/* ---------------------------------- state --------------------------------- */
	let verifyTokenDialogOpen = $state(false);

	/* ---------------------------------- forms --------------------------------- */
	const sf_updateEmailForm = superForm(updateEmailForm, {
		resetForm: false,
		onUpdated: ({ form }) => {
			if (!form.valid) return;
			verifyTokenDialogOpen = true;
		}
	});

	const sf_verifyEmailForm = superForm(verifyEmailForm, {
		onUpdated: ({ form }) => {
			if (!form.valid) return;
			verifyTokenDialogOpen = false;
		}
	});

	const {
		form: updateEmailFormData,
		submit: submitEmailForm,
		enhance: updateEmailFormEnhance
	} = sf_updateEmailForm;

	const {
		form: verifyEmailFormData,
		enhance: verifyEmailFormEnhance,
		submit: verifyEmailFormSubmit
	} = sf_verifyEmailForm;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Change Email</Card.Title>
		<Card.Description>Used to identify your store in the marketplace.</Card.Description>
	</Card.Header>
	<Card.Content>
		<form method="POST" action="?/updateEmail" use:updateEmailFormEnhance>
			<Form.Field form={sf_updateEmailForm} name="email">
				<Form.Control let:attrs>
					<Form.Label>Email</Form.Label>
					<Input {...attrs} bind:value={$updateEmailFormData.email} />
				</Form.Control>
				<Form.Description />
				<Form.FieldErrors />
			</Form.Field>
		</form>
	</Card.Content>
	<Card.Footer class="border-t px-6 py-4">
		<Form.Button on:click={() => submitEmailForm()}>Submit</Form.Button>
	</Card.Footer>
</Card.Root>

<!-- Dialogs -->
<Dialog.Root bind:open={verifyTokenDialogOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Verify Email</Dialog.Title>
			<Dialog.Description>
				A code has been sent to the email address specified. Enter the code to confirm your address
				change.
			</Dialog.Description>
		</Dialog.Header>
		<form method="POST" action="?/verifyEmail" use:verifyEmailFormEnhance>
			<Form.Field form={sf_verifyEmailForm} name="token">
				<Form.Control let:attrs>
					<Form.Label />
					<PinInput {...attrs} bind:value={$verifyEmailFormData.token} placeholder="Token..." />
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
		</form>
		<Dialog.Footer>
			<Form.Button on:click={() => verifyEmailFormSubmit()}>Verify</Form.Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
