<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils/ui';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children: Snippet;
	}

	let { class: classNames, children, ...restProps }: Props = $props();
</script>

<div {...restProps} class={cn('mx-auto w-full max-w-6xl px-0 md:px-6', classNames)}>
	{@render children()}
</div>
