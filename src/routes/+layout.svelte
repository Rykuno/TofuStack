<script lang="ts">
	import '../app.css';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	const { data, children } = $props();
</script>

<QueryClientProvider client={data.queryClient}>
	<main class="antialiased">
		{@render children()}
	</main>
	<SvelteQueryDevtools />
</QueryClientProvider>
