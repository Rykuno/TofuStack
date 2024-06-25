<script>
	import UpdateEmailCard from './update-email-card.svelte';

	let { data } = $props();
</script>

<UpdateEmailCard updateEmailForm={data.updateEmailForm} verifyEmailForm={data.verifyEmailForm} />
