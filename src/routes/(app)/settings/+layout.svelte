<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils/ui';

	let { children } = $props();
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
		<a
			href="/settings"
			class={cn($page.url.pathname === '/settings' && 'font-semibold text-primary')}>Profile</a
		>
		<a
			href="/settings/account"
			class={cn($page.url.pathname === '/settings/account' && 'font-semibold text-primary')}
			>Account</a
		>
	</nav>
	<div class="grid gap-6">
		{@render children()}
	</div>
</div>
