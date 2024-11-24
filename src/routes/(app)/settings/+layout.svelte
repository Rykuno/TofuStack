<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/ui';

	const { children } = $props();

	const tabs = [
		{
			label: 'Profile',
			href: '/settings'
		},
		{
			label: 'Account',
			href: '/settings/account'
		}
	];
</script>

<div class="mx-auto grid w-full max-w-6xl gap-2">
	<h1 class="text-3xl font-semibold">Settings</h1>
</div>
<div
	class="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]"
>
	<nav
		class="grid gap-4 text-sm text-muted-foreground"
		data-x-chunk-container="chunk-container after:right-0"
	>
		{#each tabs as tab}
			<a href={tab.href} class={cn($page.url.pathname === tab.href && 'font-semibold text-primary')}
				>{tab.label}</a
			>
		{/each}
	</nav>
	{@render children()}
</div>
