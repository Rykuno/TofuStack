<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	const { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<main class="antialiased">
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
