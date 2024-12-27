<script lang="ts">
	import { api } from '$lib/tanstack-query';
	import { createQuery } from '@tanstack/svelte-query';
	const authedUserQuery = createQuery(api().users.me());
</script>

<p>Authed User: {$authedUserQuery?.data?.email || 'None'}</p>
